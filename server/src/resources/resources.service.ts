import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { User } from 'src/auth/user.types'
import { SampleTableDto } from 'src/queries/queries.dto'
import { createPostgresConnectionPool } from 'src/utils/postgres'
import { postgresColumnTypes } from 'src/utils/postgres-column-types'
import { Resource } from './resource.entity'
import { ResourceRepository } from './resource.repository'
import {
  CreateResourceDto,
  TestResourceDto,
  UpdateResourceDto,
} from './resources.dto'

const ENCRYPTED_PASSWORD_STRING = '---encrypted-password---'

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceRepository)
    private resourcesRepository: ResourceRepository,
  ) {}

  encryptResource(resource: Resource): Resource {
    return {
      ...resource,
      password: ENCRYPTED_PASSWORD_STRING,
    }
  }

  /**
   * Returns the resource data
   *
   * @param id - Id of the resource
   */
  async getResource(
    id: number,
    user: User,
    encrypt: boolean = true,
  ): Promise<Resource> {
    const resource = await this.resourcesRepository.findOne({
      id,
      uid: user.uid,
    })
    if (!resource) {
      throw new NotFoundException('resource not found')
    }
    return encrypt ? this.encryptResource(resource) : resource
  }

  /**
   * Returns all the resources
   */
  getAllResources(user: User): Promise<Resource[]> {
    return this.resourcesRepository
      .find({ order: { createdAt: 'ASC' }, where: { uid: user.uid } })
      .then(resources => resources.map(this.encryptResource))
  }

  /**
   * Create a resource
   *
   * @param createResourceDto - Data for creating resource
   */
  async createResource(
    createResourceDto: CreateResourceDto,
    user: User,
  ): Promise<Resource> {
    return this.resourcesRepository
      .save({ ...createResourceDto, uid: user.uid })
      .then(resource => this.encryptResource(resource))
  }

  /**
   * Updates a particular resource
   *
   * @param id - Id of the resource
   * @param updateResourceDto - Data for updating the resource
   */
  async updateResource(
    id: number,
    updateResourceDto: UpdateResourceDto,
    user: User,
  ): Promise<Resource> {
    const { password } = updateResourceDto
    const updatedData = {
      ...updateResourceDto,
      password: password !== ENCRYPTED_PASSWORD_STRING ? password : undefined,
    }
    return this.resourcesRepository
      .update({ id, uid: user.uid }, updatedData)
      .then(() => this.getResource(id, user))
      .then(resource => this.encryptResource(resource))
  }

  /**
   * Delete a particular resource
   *
   * @param id - Id of the resource to be deleted
   */
  async deleteResource(id: number, user: User): Promise<Resource> {
    const resource = await this.getResource(id, user)
    await this.resourcesRepository.remove([resource])
    return this.encryptResource(resource)
  }

  /**
   * Test whether the configuration for a resource is valid or not
   * by connecting to the corresponding database
   *
   * @param resource - Resource to be tested
   */
  async testResource(resource: TestResourceDto): Promise<boolean> {
    if (resource.type === 'postgres') {
      const pool = createPostgresConnectionPool(resource)

      try {
        await pool.query('SELECT NOW()')
        return true
      } catch (error) {
        throw new InternalServerErrorException(error)
      } finally {
        pool.end()
      }
    }

    throw new InternalServerErrorException('database type not yet implemented')
  }

  /**
   * Test whether the configuration for a resource is valid or not
   * by connecting to the corresponding database
   *
   * @param id - Id of the resource to be tested
   */
  async testSavedResource(id: number, user: User) {
    const resource = await this.getResource(id, user, false)
    return this.testResource(resource)
  }

  /**
   * Fetch schema for a particular resource
   *
   * @param id - Id of the resource whose schema is to be fetched
   */
  async fetchSchema(id: number, user: User): Promise<any[]> {
    const resource = await this.getResource(id, user, false)

    if (resource.type === 'postgres') {
      const pool = createPostgresConnectionPool(resource)

      try {
        const { rows: tableRows } = await pool.query(
          "SELECT * from information_schema.tables where table_schema != 'pg_catalog' AND table_schema != 'information_schema';",
        )
        const tables = tableRows.map(row => row.table_name)
        const tableRowQueries = await Promise.all(
          tables.map(table =>
            pool.query(
              `SELECT * FROM information_schema.columns WHERE table_name = '${table}'`,
            ),
          ),
        )

        return tables.map((table, index) => {
          return {
            table,
            columns: tableRowQueries[index].rows.map(row => {
              const rowData = omit(row, [
                'table_catalog',
                'table_name',
                'table_schema',
              ])
              rowData.data_type =
                postgresColumnTypes[rowData.data_type] ?? rowData.data_type
              return rowData
            }),
          }
        })
      } catch (error) {
        throw new InternalServerErrorException(error)
      } finally {
        pool.end()
      }
    }

    throw new InternalServerErrorException('database type not yet implemented')
  }

  async fetchSampleData(sampleTableDto: SampleTableDto, user: User) {
    const { resource: resourceId, tableName } = sampleTableDto
    const resource = await this.getResource(resourceId, user, false)

    if (resource.type === 'postgres') {
      const pool = createPostgresConnectionPool(resource)
      try {
        return await pool.query(`SELECT * FROM ${tableName} LIMIT 10;`)
      } catch (error) {
        throw new InternalServerErrorException(error)
      } finally {
        pool.end()
      }
    }

    throw new InternalServerErrorException('database type not yet implemented')
  }
}

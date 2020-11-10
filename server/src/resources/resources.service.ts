import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { createPostgresConnectionPool } from 'src/utils/postgres'
import { Resource } from './resource.entity'
import { ResourceRepository } from './resource.repository'
import {
  CreateResourceDto,
  TestResourceDto,
  UpdateResourceDto,
} from './resources.dto'

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceRepository)
    private resourcesRepository: ResourceRepository,
  ) {}

  /**
   * Returns the resource data
   *
   * @param id - Id of the resource
   */
  async getResource(id: number): Promise<Resource> {
    const resource = await this.resourcesRepository.findOne({ id })
    if (!resource) {
      throw new NotFoundException('resource not found')
    }
    return resource
  }

  /**
   * Returns all the resources
   */
  getAllResources(): Promise<Resource[]> {
    return this.resourcesRepository.find()
  }

  /**
   * Create a resource
   *
   * @param createResourceDto - Data for creating resource
   */
  async createResource(
    createResourceDto: CreateResourceDto,
  ): Promise<Resource> {
    return this.resourcesRepository.save(createResourceDto)
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
  ): Promise<Resource> {
    return this.resourcesRepository
      .update({ id }, updateResourceDto)
      .then(() => this.getResource(id))
  }

  /**
   * Delete a particular resource
   *
   * @param id - Id of the resource to be deleted
   */
  async deleteResource(id: number): Promise<Resource> {
    const resource = await this.getResource(id)
    await this.resourcesRepository.remove([resource])
    return resource
  }

  /**
   * Test whether the configuration for a resource is valid or not
   * by connecting to the corresponding database
   *
   * @param id - Id of the resource to be tested
   */
  async testResource(
    resource: TestResourceDto,
  ): Promise<{ success: boolean; message: string }> {
    if (resource.type === 'postgres') {
      const pool = createPostgresConnectionPool(resource)

      try {
        await pool.query('SELECT NOW()')
        return { success: true, message: 'database connected successfully' }
      } catch (error) {
        throw new InternalServerErrorException(error)
      } finally {
        pool.end()
      }
    }

    throw new InternalServerErrorException('database type not yet implemented')
  }

  /**
   * Fetch schema for a particular resource
   *
   * @param id - Id of the resource whose schema is to be fetched
   */
  async fetchSchema(id: number): Promise<{ success: boolean; data: any[] }> {
    const resource = await this.getResource(id)

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
        return {
          success: true,
          data: tables.map((table, index) => {
            return {
              table,
              columns: tableRowQueries[index].rows.map(row =>
                omit(row, ['table_catalog', 'table_name', 'table_schema']),
              ),
            }
          }),
        }
      } catch (error) {
        throw new InternalServerErrorException(error)
      } finally {
        pool.end()
      }
    }

    throw new InternalServerErrorException('database type not yet implemented')
  }
}

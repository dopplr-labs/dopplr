import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { ClientFactory } from 'src/db-clients/client-factory'
import { SampleTableDto } from 'src/queries/queries.dto'
import { QueriesService } from 'src/queries/queries.service'
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
    @Inject(forwardRef(() => QueriesService))
    private queriesService: QueriesService,
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
    const { password, ...restData } = updateResourceDto
    const updatedData: Partial<UpdateResourceDto> = restData

    if (password !== ENCRYPTED_PASSWORD_STRING) {
      updatedData.password = password
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
    await this.queriesService.deleteQueriesForResource(resource, user)
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
    const client = ClientFactory.createClient(resource)
    return client.testConnection()
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
  async fetchSchema(id: number, user: User) {
    const resource = await this.getResource(id, user, false)

    const client = ClientFactory.createClient(resource)
    return client.getSchema()
  }

  /**
   * Fetch sample data for a particular resource. Sample data are the first 10 rows
   * for a particular table
   *
   * @param sampleTableDto - DTO for getting sample table for a resource
   * @param user - User requesting sample data
   */
  async fetchSampleData(sampleTableDto: SampleTableDto, user: User) {
    const { resource: resourceId, tableName } = sampleTableDto
    const resource = await this.getResource(resourceId, user, false)
    const client = ClientFactory.createClient(resource)
    return client.fetchTableSampleData(tableName)
  }
}

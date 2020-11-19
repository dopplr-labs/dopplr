import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { SampleTableDto } from 'src/queries/queries.dto'
import { Resource } from './resource.entity'
import {
  CreateResourceDto,
  TestResourceDto,
  UpdateResourceDto,
} from './resources.dto'
import { ResourcesService } from './resources.service'

@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get()
  async getAllResources(): Promise<{ success: boolean; data: Resource[] }> {
    const resources = await this.resourcesService.getAllResources()
    return { success: true, data: resources }
  }

  @Get('sample-data')
  async fetchSampleData(@Query() sampleTableDto: SampleTableDto) {
    const data = await this.resourcesService.fetchSampleData(sampleTableDto)
    return { success: true, data }
  }

  @Get(':id')
  async getResource(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: Resource }> {
    const resource = await this.resourcesService.getResource(id)
    return { success: true, data: resource }
  }

  @Post()
  async createResource(
    @Body() createResourceDto: CreateResourceDto,
  ): Promise<{ success: boolean; data: Resource }> {
    const resource = await this.resourcesService.createResource(
      createResourceDto,
    )
    return { success: true, data: resource }
  }

  @Patch(':id')
  async updateResource(
    @Param('id') id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<{ success: boolean; data: Resource }> {
    const resource = await this.resourcesService.updateResource(
      id,
      updateResourceDto,
    )
    return { success: true, data: resource }
  }

  @Delete(':id')
  async deleteResource(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: Resource }> {
    const resource = await this.resourcesService.deleteResource(id)
    return { success: true, data: resource }
  }

  @Post('test')
  @HttpCode(200)
  async testResource(
    @Body() testResourceDto: TestResourceDto,
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.resourcesService.testResource(testResourceDto)
    return { success, message: 'database connected successfully' }
  }

  @Post('test-saved')
  @HttpCode(200)
  async testSavedResource(
    @Body('resource') resourceId: number,
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.resourcesService.testSavedResource(resourceId)
    return { success, message: 'database connected successfully' }
  }

  @Get('schema/:id')
  @HttpCode(200)
  async fetchSchema(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: any[] }> {
    const data = await this.resourcesService.fetchSchema(id)
    return { success: true, data }
  }
}

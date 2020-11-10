import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
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
    return this.resourcesService.testResource(testResourceDto)
  }

  @Post('schema/:id')
  @HttpCode(200)
  async fetchSchema(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: any[] }> {
    return this.resourcesService.fetchSchema(id)
  }
}

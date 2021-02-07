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
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import { SampleTableDto } from 'src/queries/queries.dto'
import { Resource } from './resource.entity'
import {
  CreateResourceDto,
  TestResourceDto,
  UpdateResourceDto,
} from './resources.dto'
import { ResourcesService } from './resources.service'

@Controller('resources')
@UseGuards(AuthGuard)
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get()
  async getAllResources(
    @GetUser() user,
  ): Promise<{ success: boolean; data: Resource[] }> {
    const resources = await this.resourcesService.getAllResources(user)
    return { success: true, data: resources }
  }

  @Get('sample-data')
  async fetchSampleData(
    @Query() sampleTableDto: SampleTableDto,
    @GetUser() user,
  ) {
    const data = await this.resourcesService.fetchSampleData(
      sampleTableDto,
      user,
    )
    return { success: true, data }
  }

  @Get(':id')
  async getResource(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Resource }> {
    const resource = await this.resourcesService.getResource(id, user)
    return { success: true, data: resource }
  }

  @Post()
  async createResource(
    @Body() createResourceDto: CreateResourceDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Resource }> {
    const resource = await this.resourcesService.createResource(
      createResourceDto,
      user,
    )
    return { success: true, data: resource }
  }

  @Patch(':id')
  async updateResource(
    @Param('id') id: number,
    @Body() updateResourceDto: UpdateResourceDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Resource }> {
    const resource = await this.resourcesService.updateResource(
      id,
      updateResourceDto,
      user,
    )
    return { success: true, data: resource }
  }

  @Delete(':id')
  async deleteResource(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Resource }> {
    const resource = await this.resourcesService.deleteResource(id, user)
    return { success: true, data: resource }
  }

  @Post('test')
  @HttpCode(200)
  async testResource(
    @Body() testResourceDto: TestResourceDto,
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.resourcesService.testResource(testResourceDto)
    return {
      success,
      message: success
        ? 'database connected successfully'
        : 'database connection error',
    }
  }

  @Post('test-saved')
  @HttpCode(200)
  async testSavedResource(
    @Body('resource') resourceId: number,
    @GetUser() user,
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.resourcesService.testSavedResource(
      resourceId,
      user,
    )
    return {
      success,
      message: success
        ? 'database connected successfully'
        : 'database connection error',
    }
  }

  @Get('schema/:id')
  @HttpCode(200)
  async fetchSchema(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: any[] }> {
    const data = await this.resourcesService.fetchSchema(id, user)
    return { success: true, data }
  }
}

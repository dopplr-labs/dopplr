import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import { Dashboard } from './dashboard.entity'
import { DashboardsService } from './dashboards.service'
import { CreateDashboardDto, UpdateDashboardDto } from './dashboards.dto'
import { Category } from './category.entity'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto'

@Controller('dashboards')
@UseGuards(AuthGuard)
export class DashboardsController {
  constructor(
    private dashboardsService: DashboardsService,
    private categoriesService: CategoriesService,
  ) {}

  @Get()
  async getAllDashboards(
    @GetUser() user,
  ): Promise<{ success: boolean; data: Dashboard[] }> {
    const dashboards = await this.dashboardsService.getAllDashboards(user)
    return { success: true, data: dashboards }
  }

  @Get('categories')
  async getAllCategories(
    @GetUser() user,
  ): Promise<{ success: boolean; data: Category[] }> {
    const categories = await this.categoriesService.getAllCategories(user)
    return { success: true, data: categories }
  }

  @Get('categories/:id')
  async getCategory(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Category }> {
    const category = await this.categoriesService.getCategory(id, user)
    return { success: true, data: category }
  }

  @Get(':id')
  async getDashboard(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Dashboard }> {
    const dashboard = await this.dashboardsService.getDashboard(id, user)
    return { success: true, data: dashboard }
  }

  @Post()
  async createDashboard(
    @Body() createDashboardDto: CreateDashboardDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Dashboard }> {
    const dashboard = await this.dashboardsService.createDashboard(
      createDashboardDto,
      user,
    )
    return { success: true, data: dashboard }
  }

  @Post('categories')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Category }> {
    const category = await this.categoriesService.createCategory(
      createCategoryDto,
      user,
    )
    return { success: true, data: category }
  }

  @Patch('categories/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Category }> {
    const category = await this.categoriesService.updateCategory(
      id,
      updateCategoryDto,
      user,
    )
    return { success: true, data: category }
  }

  @Patch(':id')
  async updateDashboard(
    @Param('id') id: number,
    @Body() updateDashboardDto: UpdateDashboardDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Dashboard }> {
    const dashboard = await this.dashboardsService.updateDashboard(
      id,
      updateDashboardDto,
      user,
    )
    return { success: true, data: dashboard }
  }

  @Delete(':id')
  async deleteDashboard(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Dashboard }> {
    const dashboard = await this.dashboardsService.deleteDashboard(id, user)
    return { success: true, data: dashboard }
  }

  @Delete('categories/:id')
  async deleteCategory(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Category }> {
    const category = await this.categoriesService.deleteCategory(id, user)
    return { success: true, data: category }
  }
}

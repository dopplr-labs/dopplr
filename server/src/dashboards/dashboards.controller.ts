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

@Controller('dashboards')
@UseGuards(AuthGuard)
export class DashboardsController {
  constructor(private dashboardsService: DashboardsService) {}

  @Get()
  async getAllDashboards(
    @GetUser() user,
  ): Promise<{ success: boolean; data: Dashboard[] }> {
    const dashboards = await this.dashboardsService.getAllDashboards(user)
    return { success: true, data: dashboards }
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
}

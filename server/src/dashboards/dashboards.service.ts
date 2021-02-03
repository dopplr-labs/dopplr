import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { Dashboard } from './dashboard.entity'
import { DashboardRepository } from './dashboard.repository'
import { CreateDashboardDto, UpdateDashboardDto } from './dashboards.dto'

@Injectable()
export class DashboardsService {
  constructor(
    @InjectRepository(DashboardRepository)
    private dashboardRepository: DashboardRepository,
  ) {}

  async getAllDashboards(user: User): Promise<Dashboard[]> {
    const dashboards = await this.dashboardRepository.find({
      order: { createdAt: 'DESC' },
      where: { uid: user.uid },
    })
    return dashboards
  }

  async getDashboard(id: number, user: User): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findOne({
      id,
      uid: user.uid,
    })
    return dashboard
  }

  async createDashboard(
    createDashboardDto: CreateDashboardDto,
    user: User,
  ): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.save({
      ...createDashboardDto,
      uid: user.uid,
    })
    return dashboard
  }

  updateDashboard(
    id: number,
    updateDashboardDto: UpdateDashboardDto,
    user: User,
  ): Promise<Dashboard> {
    return this.dashboardRepository
      .update({ id, uid: user.uid }, updateDashboardDto)
      .then(() => this.getDashboard(id, user))
  }

  async deleteDashboard(id: number, user: User): Promise<Dashboard> {
    const dashboard = await this.getDashboard(id, user)
    await this.dashboardRepository.remove([dashboard])
    return { ...dashboard, id }
  }
}

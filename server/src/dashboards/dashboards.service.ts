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

  /**
   * Returns all the dashboards for a user
   *
   * @param user
   */
  async getAllDashboards(user: User): Promise<Dashboard[]> {
    const dashboards = await this.dashboardRepository.find({
      order: { createdAt: 'DESC' },
      where: { uid: user.uid },
    })
    return dashboards
  }

  /**
   * Returns the dashboard data
   *
   * @param id - id of the dashboard user wants to fetch
   * @param user
   */
  async getDashboard(id: number, user: User): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findOne({
      id,
      uid: user.uid,
    })
    return dashboard
  }

  /**
   * Create a dashboard
   *
   * @param createDashboardDto - Data for creating a dashboard
   * @param user
   */
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

  /**
   * Updates a particular dashboard
   *
   * @param id - id of the dashboard user wants to update
   * @param updateDashboardDto - Data for updating the dashboard
   * @param user
   */
  updateDashboard(
    id: number,
    updateDashboardDto: UpdateDashboardDto,
    user: User,
  ): Promise<Dashboard> {
    return this.dashboardRepository
      .update({ id, uid: user.uid }, updateDashboardDto)
      .then(() => this.getDashboard(id, user))
  }

  /**
   * Delete a particular dashboard
   *
   * @param id - id of the dashboard user wants to delete
   * @param user
   */
  async deleteDashboard(id: number, user: User): Promise<Dashboard> {
    const dashboard = await this.getDashboard(id, user)
    await this.dashboardRepository.remove([dashboard])
    return { ...dashboard, id }
  }
}

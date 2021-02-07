import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { CategoriesService } from './categories.service'
import { Dashboard } from './dashboard.entity'
import { DashboardRepository } from './dashboard.repository'
import { CreateDashboardDto, UpdateDashboardDto } from './dashboards.dto'

@Injectable()
export class DashboardsService {
  constructor(
    @InjectRepository(DashboardRepository)
    private dashboardRepository: DashboardRepository,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
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
    if (!dashboard) {
      throw new NotFoundException('dashboard not found')
    }
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
    const { category: categoryId } = createDashboardDto
    const category = await this.categoriesService.getCategory(categoryId, user)
    const dashboard = await this.dashboardRepository.save({
      ...createDashboardDto,
      category,
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
  async updateDashboard(
    id: number,
    updateDashboardDto: UpdateDashboardDto,
    user: User,
  ): Promise<Dashboard> {
    const { category: categoryId } = updateDashboardDto
    const updateDashboardData: any = updateDashboardDto
    if (categoryId) {
      const category = await this.categoriesService.getCategory(
        categoryId,
        user,
      )
      updateDashboardData.category = category
    }
    return this.dashboardRepository
      .update({ id, uid: user.uid }, updateDashboardData)
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

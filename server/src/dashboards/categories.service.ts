import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto'
import { Category } from './category.entity'
import { CategoryRepository } from './category.repository'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  /**
   * Returns all the categories for dashboards
   *
   * @param user
   */
  async getAllCategories(user: User): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      order: { createdAt: 'DESC' },
      where: { uid: user.uid },
    })
    return categories
  }

  /**
   * Returns a particular category data
   *
   * @param id - id of the category user wants to fetch
   * @param user
   */
  async getCategory(id: number, user: User) {
    const category = await this.categoryRepository.findOne({
      id,
      uid: user.uid,
    })
    if (!category) {
      throw new NotFoundException('category not found')
    }
    return category
  }

  /**
   * Create a category
   *
   * @param createCategoryDto - Data for creating a category
   * @param user
   */
  async createCategory(
    createCategoryDto: CreateCategoryDto,
    user: User,
  ): Promise<Category> {
    const { parent: parentId } = createCategoryDto
    const createCategoryData: any = { ...createCategoryDto, uid: user.uid }
    if (parentId) {
      const parent = await this.getCategory(parentId, user)
      createCategoryData.parent = parent
    }
    const category = await this.categoryRepository.save(createCategoryData)
    return category
  }

  /**
   * Updates a particular dashboard category
   *
   * @param id - id of the category user wants to update
   * @param updateCategoryDto - Data for updating the category
   * @param user
   */
  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    user: User,
  ): Promise<Category> {
    const { parent: parentId } = updateCategoryDto
    const updateCategoryData: any = updateCategoryDto
    if (parentId) {
      const parent = await this.getCategory(parentId, user)
      updateCategoryData.parent = parent
    }
    return this.categoryRepository
      .update({ id, uid: user.uid }, updateCategoryData)
      .then(() => this.getCategory(id, user))
  }

  /**
   * Delete a particular category
   *
   * @param id - id of the category user wants to delete
   * @param user
   */
  async deleteCategory(id: number, user: User): Promise<Category> {
    const category = await this.getCategory(id, user)
    await this.categoryRepository.remove([category])
    return { ...category, id }
  }
}

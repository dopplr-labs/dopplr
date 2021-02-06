import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { CreateCategoryDto } from './categories.dto'
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
    const parent = await this.getCategory(parentId, user)
    const category = await this.categoryRepository.save({
      ...createCategoryDto,
      parent,
      uid: user.uid,
    })
    return category
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

import { EntityRepository, Repository } from 'typeorm'
import { Chart } from './chart.entity'

@EntityRepository(Chart)
export class ChartRepository extends Repository<Chart> {}

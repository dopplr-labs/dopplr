import { EntityRepository, Repository } from 'typeorm'
import { Query } from './query.entity'

@EntityRepository(Query)
export class QueryRepository extends Repository<Query> {}

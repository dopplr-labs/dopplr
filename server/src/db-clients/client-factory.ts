import { NotImplementedException } from '@nestjs/common'
import { ClientInterface, ClientResource, ClientType } from './client.interface'
import { MysqlClient } from './mysql-client'
import { PgClient } from './pg-client'

export class ClientFactory {
  static createClient(resource: ClientResource): ClientInterface {
    switch (resource.type) {
      case ClientType.POSTGRES: {
        return new PgClient(resource)
      }

      case ClientType.MYSQL: {
        return new MysqlClient(resource)
      }

      default: {
        throw new NotImplementedException(
          `Client for ${resource.type} is not implemented yet!`,
        )
      }
    }
  }
}

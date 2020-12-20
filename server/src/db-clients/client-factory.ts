import { NotImplementedException } from '@nestjs/common'
import { ClientInterface, ClientResource } from './client.interface'
import { PgClient } from './pg-client'

export class ClientFactory {
  static createClient(resource: ClientResource): ClientInterface {
    switch (resource.type) {
      case 'postgres': {
        return new PgClient(resource)
      }

      default: {
        throw new NotImplementedException(
          `Client for ${resource.type} is not implemented yet!`,
        )
      }
    }
  }
}

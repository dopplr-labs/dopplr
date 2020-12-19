import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from './user.types'

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest()
    return req.user
  },
)

import { Inject, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'

export class AuthMiddleware implements NestMiddleware {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers as { authorization?: string }

    if (authorization) {
      const user = await this.authService.verifyIdToken(authorization)
      if (user) {
        // @ts-ignore
        req.user = user
      }
    }

    next()
  }
}

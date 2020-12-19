import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { User } from './user.types'

@Injectable()
export class AuthService {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY as string)?.replace(
        /\\n/g,
        '\n',
      ),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    }),
  })

  async verifyIdToken(idToken: string): Promise<User | undefined> {
    try {
      const decodedToken = await this.firebaseApp.auth().verifyIdToken(idToken)
      const user = await this.firebaseApp.auth().getUser(decodedToken.uid)
      return user
    } catch (error) {
      return undefined
    }
  }

  async getUser(uid: string): Promise<User | undefined> {
    try {
      const user = await this.firebaseApp.auth().getUser(uid)
      return user
    } catch (error) {
      return undefined
    }
  }
}

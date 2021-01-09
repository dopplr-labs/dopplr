export type Resource = {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  type: string
  username: string
  password: string
  database: string
  host: string
  port: number
  sslRequired?: boolean
  selfCertificate?: boolean
  clientKey?: string
  clientCertificate?: string
}

import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import * as ws from 'ws'
import * as rpc from 'vscode-ws-jsonrpc'
import { ResourcesService } from 'src/resources/resources.service'
import { AuthService } from 'src/auth/auth.service'
import { launch, SqlLanguageServer } from './language-server'

type WsClient = ws & { languageServer: SqlLanguageServer | undefined }

@WebSocketGateway()
export class LanguageServerGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: ws.Server

  logger = new Logger('LanguageServerGateway')

  constructor(
    private resourcesService: ResourcesService,
    private authService: AuthService,
  ) {}

  handleDisconnect(client: WsClient) {
    if (client.languageServer) {
      client.languageServer.stop()
    }
  }

  handleConnection(client: WsClient) {
    const socket: rpc.IWebSocket = {
      send: content =>
        client.send(content, error => {
          if (error) {
            throw error
          }
        }),
      onMessage: cb => client.on('message', cb),
      onError: cb => client.on('error', cb),
      onClose: cb => {
        client.on('close', cb)
      },
      dispose: () => {
        client.close()
      },
    }
    // launch the server when the web socket is opened
    if (client.readyState === client.OPEN) {
      client.languageServer = launch(
        socket,
        this.resourcesService,
        this.authService,
      )
    } else {
      client.on('open', () => {
        client.languageServer = launch(
          socket,
          this.resourcesService,
          this.authService,
        )
      })
    }
  }
}

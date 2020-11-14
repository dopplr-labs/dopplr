import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import * as ws from 'ws'
import * as rpc from 'vscode-ws-jsonrpc'
import { ResourcesService } from 'src/resources/resources.service'
import { launch } from './language-server'

@WebSocketGateway()
export class LanguageServerGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: ws.Server

  logger = new Logger('LanguageServerGateway')

  constructor(private resourcesService: ResourcesService) {}

  handleConnection(client: ws) {
    const socket: rpc.IWebSocket = {
      send: content =>
        client.send(content, error => {
          if (error) {
            throw error
          }
        }),
      onMessage: cb => client.on('message', cb),
      onError: cb => client.on('error', cb),
      onClose: cb => client.on('close', cb),
      dispose: () => client.close(),
    }
    // launch the server when the web socket is opened
    if (client.readyState === client.OPEN) {
      launch(socket, this.resourcesService)
    } else {
      client.on('open', () => launch(socket, this.resourcesService))
    }
  }
}

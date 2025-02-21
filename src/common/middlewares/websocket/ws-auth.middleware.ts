import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import WebSocketClient from "src/infrastructure/messaging/websocket/websocket-client"

@Injectable()
class WsAuthMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  public async authenticate(client: WebSocketClient, token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token)
      const userId = decoded.id || decoded.sub

      if (!userId) {
        throw new UnauthorizedException("Token payload does not contain user identifier")
      }

      client.data.set("user", { id: userId, ...decoded })

      return true
    } catch (error: unknown) {
      throw new UnauthorizedException(`Invalid token ${error}`)
    }
  }
}

export default WsAuthMiddleware

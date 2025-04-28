/**
 * @author Wildan Frananda [Fullstack Developer | Mobile Developer]
 */

import { NestFactory, Reflector } from "@nestjs/core"
import { AppModule } from "./app.module"
import { configDotenv } from "dotenv"
import { ValidationPipe } from "@nestjs/common"
import { NestExpressApplication } from "@nestjs/platform-express"
import JwtAuthGuard from "./common/guards/jwt.guard"
import { WsAdapter } from "@nestjs/platform-ws"
import helmet from "helmet"

configDotenv()

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const reflector = app.get(Reflector)

  app.useGlobalGuards(new JwtAuthGuard(reflector))
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  app.useWebSocketAdapter(new WsAdapter())
  app.setGlobalPrefix("api")
  app.enableShutdownHooks()
  app.use(helmet())
  await app.listen(8080)
  await app.init()

  console.log(`Server listening on ${await app.getUrl()}`)
}

bootstrap().catch((err) => console.error(err))

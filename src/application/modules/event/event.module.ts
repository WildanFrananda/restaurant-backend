import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import AdminEventController from "src/api/http/controllers/admin/event/admin-event.controller"
import EventSSEController from "src/api/sse/controllers/event/event-sse.controller"
import EventService from "src/application/services/event/event.service"
import EventSSEService from "src/application/services/sse/event/event-sse.service"
import AppEvent from "src/domain/entities/event.entity"
import EventRepository from "src/domain/repositories/event.repository"
import EventRepositoryImpl from "src/infrastructure/database/repositories/event.repository"

@Module({
  imports: [MikroOrmModule.forFeature([AppEvent])],
  controllers: [AdminEventController, EventSSEController],
  providers: [
    {
      provide: EventRepository,
      useClass: EventRepositoryImpl
    },
    EventService,
    EventSSEService
  ]
})
export class EventModule {}

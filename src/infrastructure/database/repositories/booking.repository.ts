import { Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject } from "@nestjs/common"
import Booking from "src/domain/entities/booking.entity"
import BookingRepository from "src/domain/repositories/booking.repository"

class BookingRepositoryImpl extends BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: EntityRepository<Booking>,
    @Inject(EntityManager)
    private readonly em: EntityManager
  ) {
    super()
  }

  public override async persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void> {
    this.em.persist(data)
    await this.em.flush()
  }

  public override async findBookingId(id: string): Promise<Booking | null> {
    return await this.bookingRepository.findOne({ id })
  }
}

export default BookingRepositoryImpl

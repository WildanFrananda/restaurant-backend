import { Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import Booking from "src/domain/entities/booking.entity"
import Menu from "src/domain/entities/menu.entity"
import Table from "src/domain/entities/table.entity"
import User from "src/domain/entities/user.entity"
import BookingStatus from "src/domain/enums/booking-status.enum"
import BookingType from "src/domain/enums/booking-type.enum"
import BookingRepository from "src/domain/repositories/booking.repository"

@Injectable()
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

  public override create(
    user: { id: string },
    type: BookingType,
    schedule: Date,
    status: BookingStatus,
    table?: Table,
    menu?: Menu,
    location?: string
  ): Booking {
    const booking = this.bookingRepository.create({
      user: this.em.getReference(User, user.id),
      type,
      schedule,
      status,
      table,
      menu,
      location,
      createdAt: new Date()
    })

    return booking
  }

  public override async filterBookingById(id: string): Promise<Booking | null> {
    return await this.bookingRepository.findOne({ id }, { populate: ["menu", "table"] })
  }

  public override async findBookingById(id: string): Promise<Booking | null> {
    return await this.bookingRepository.findOne({ id })
  }

  public override async filterBookingByConditions(
    conditions: Record<string, unknown>
  ): Promise<Booking[] | null> {
    return await this.bookingRepository.find(conditions, { populate: ["menu", "table", "chef"] })
  }
}

export default BookingRepositoryImpl

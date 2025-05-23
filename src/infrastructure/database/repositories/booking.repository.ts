import { Loaded, Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import Booking from "src/domain/entities/booking.entity"
import Menu from "src/domain/entities/menu.entity"
import Table from "src/domain/entities/table.entity"
import User from "src/domain/entities/user.entity"
import BookingStatus from "src/domain/enums/booking-status.enum"
import BookingType from "src/domain/enums/booking-type.enum"
import ChefLocation from "src/domain/enums/chef-location.enum"
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
    chefLocation?: ChefLocation,
    table?: Table,
    menu?: Menu,
    location?: string
  ): Booking {
    const booking = this.bookingRepository.create({
      user: this.em.getReference(User, user.id),
      type,
      schedule,
      status,
      chefLocation,
      table,
      menu,
      location,
      createdAt: new Date(),
      totalAmount: 0
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
    conditions: Record<string, unknown>,
    limit: number,
    page: number
  ): Promise<[Loaded<Booking, "user" | "chef" | "table" | "menu", "*", never>[], number]> {
    return await this.bookingRepository.findAndCount(conditions, {
      populate: ["user.profile", "menu", "table", "chef"],
      orderBy: { createdAt: "DESC" },
      limit,
      offset: (page - 1) * limit
    })
  }

  public override async findUserHistory(
    conditions: Record<string, unknown>,
    limit: number,
    page: number
  ): Promise<[Loaded<Booking, "chef" | "table" | "menu" | "transactions", "*", never>[], number]> {
    return await this.bookingRepository.findAndCount(conditions, {
      populate: ["menu", "table", "chef", "transactions"],
      orderBy: { createdAt: "DESC" },
      limit,
      offset: (page - 1) * limit
    })
  }

  public override reference(id: string): Booking {
    return this.bookingRepository.getEntityManager().getReference(Booking, id)
  }
}

export default BookingRepositoryImpl

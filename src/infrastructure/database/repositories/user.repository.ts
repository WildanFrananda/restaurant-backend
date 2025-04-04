import type { Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import UserProfile from "src/domain/entities/user-profile.entity"
import User from "src/domain/entities/user.entity"
import UserRole from "src/domain/enums/user-role.enum"
import UserRepository from "src/domain/repositories/user.repository"

@Injectable()
class UserRepositoryImpl extends UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: EntityRepository<UserProfile>,
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

  public override async findUserId(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ id })
  }

  public override async findUserEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ email })
  }

  public override async createUser(
    name: string,
    email: string,
    password: string,
    isVerified: boolean,
    role: UserRole,
    googleId?: string
  ): Promise<User> {
    const user = this.userRepository.create({
      email,
      password,
      isVerified,
      googleId,
      role,
      createdAt: new Date()
    })

    await this.persistAndFlush(user)

    const profile = this.profileRepository.create({
      userId: user.id,
      user: user,
      name,
      imageUrl: "",
      address: {},
      walletBallance: 0,
      updateAt: new Date()
    })

    user.profile = profile

    await this.persistAndFlush(profile)

    return user
  }

  public override async findUserWithProfile(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({ id: userId }, { populate: ["profile"] })
  }

  public override async findUserProfileByUserId(userId: string): Promise<UserProfile | null> {
    return await this.profileRepository.findOne({ userId })
  }

  public override async findGoogleUser(id: string, email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      $or: [
        { googleId: id },
        { email: email }
      ]
    })
  }
}

export default UserRepositoryImpl

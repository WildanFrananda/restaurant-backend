import type { Reference } from "@mikro-orm/core"
import type UserProfile from "../entities/user-profile.entity"
import type User from "../entities/user.entity"
import type UserRole from "../enums/user-role.enum"

abstract class UserRepository {
  abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  abstract findUserId(id: string): Promise<User | null>
  abstract findUserEmail(email: string): Promise<User | null>
  abstract findUserWithProfile(userId: string): Promise<User | null>
  abstract findUserProfileByUserId(userId: string): Promise<UserProfile | null>
  abstract findGoogleUser(id: string, email: string): Promise<User | null>
  abstract createUser(
    name: string,
    email: string,
    password: string,
    isVerified: boolean,
    role: UserRole,
    googleId?: string
  ): Promise<User>
}

export default UserRepository

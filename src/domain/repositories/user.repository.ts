import type { Reference } from "@mikro-orm/core"
import type UserProfile from "../entities/user-profile.entity"
import type User from "../entities/user.entity"
import type UserRole from "../enums/user-role.enum"

abstract class UserRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract adminFindAllUser(): Promise<User[] | null>
  public abstract AdminFindUserId(id: string): Promise<User | null>
  public abstract findUserId(id: string): Promise<User | null>
  public abstract findUserEmail(email: string): Promise<User | null>
  public abstract findUserWithProfile(userId: string): Promise<User | null>
  public abstract findUserProfileByUserId(userId: string): Promise<UserProfile | null>
  public abstract findGoogleUser(id: string, email: string): Promise<User | null>
  public abstract createUser(
    name: string,
    email: string,
    password: string,
    isVerified: boolean,
    role: UserRole,
    googleId?: string
  ): Promise<User>
  public abstract reference(id: string): User
}

export default UserRepository

import type User from "src/domain/entities/user.entity"
import { Injectable, NotFoundException } from "@nestjs/common"
import UserRepository from "src/domain/repositories/user.repository"

@Injectable()
class AdminUserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getAllUsers(): Promise<User[] | null> {
    return await this.userRepository.adminFindAllUser()
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.AdminFindUserId(id)

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }
}

export default AdminUserService

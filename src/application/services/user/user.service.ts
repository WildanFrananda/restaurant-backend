import type User from "src/domain/entities/user.entity"
import type UserProfile from "src/domain/entities/user-profile.entity"
import type UpdateProfileDto from "src/application/dtos/user/user-profile.dto"
import { Injectable, NotFoundException } from "@nestjs/common"
import UserRepository from "src/domain/repositories/user.repository"

@Injectable()
class UserProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getFullProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findUserWithProfile(userId)

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  public async updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<UserProfile> {
    const profile = await this.userRepository.findUserProfileByUserId(userId)

    if (!profile) {
      throw new NotFoundException("User profile not found")
    }

    if (updateDto.name !== undefined) {
      profile.name = updateDto.name
    }

    if (updateDto.imageUrl !== undefined) {
      profile.imageUrl = updateDto.imageUrl
    }

    if (updateDto.address !== undefined) {
      profile.address = updateDto.address
    }

    await this.userRepository.persistAndFlush(profile)

    return profile
  }

  public async getWallet(userId: string): Promise<number> {
    const profile = await this.userRepository.findUserProfileByUserId(userId)

    if (!profile) {
      throw new NotFoundException("User profile not found")
    }

    return Number(profile.walletBallance)
  }
}

export default UserProfileService

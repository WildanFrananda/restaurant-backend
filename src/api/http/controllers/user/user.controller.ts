import type AuthenticatedRequest from "src/common/types/user.type"
import type UpdateProfileDto from "src/application/dtos/user/user-profile.dto"
import type User from "src/domain/entities/user.entity"
import type UserProfile from "src/domain/entities/user-profile.entity"
import { Controller, Get, Put, Body, Req, Param } from "@nestjs/common"
import UserProfileService from "src/application/services/user/user.service"

@Controller("user")
class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get("profile")
  public async getProfile(@Req() req: AuthenticatedRequest): Promise<User> {
    const { userId } = req.user
    const user = await this.userProfileService.getFullProfile(userId)

    return user
  }

  @Put("profile/:id")
  public async updateProfile(
    @Param("id") id: string,
    @Body() updateDto: UpdateProfileDto
  ): Promise<UserProfile> {
    return await this.userProfileService.updateProfile(id, updateDto)
  }

  @Get("wallet")
  public async getWallet(@Req() req: AuthenticatedRequest): Promise<{ walletBallance: number }> {
    const { userId } = req.user
    const walletBallance = await this.userProfileService.getWallet(userId)

    return { walletBallance }
  }
}

export default UserProfileController

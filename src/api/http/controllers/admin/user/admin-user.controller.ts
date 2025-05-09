import { Controller, Get, Param } from "@nestjs/common"
import AdminUserService from "src/application/services/admin/user/admin-user.service"
import Admin from "src/common/decorators/admin.decorator"
import User from "src/domain/entities/user.entity"

@Admin()
@Controller("admin/user")
class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  public async getAllUsers(): Promise<User[] | null> {
    return await this.adminUserService.getAllUsers()
  }

  @Get(":id")
  public async getUserById(@Param("id") id: string): Promise<User> {
    return await this.adminUserService.getUserById(id)
  }
}

export default AdminUserController

import { applyDecorators, UseGuards } from "@nestjs/common"
import UserRole from "src/domain/enums/user-role.enum"
import JwtAuthGuard from "../guards/jwt.guard"
import RolesGuard from "../guards/roles.guard"
import { Roles } from "./roles.decorator"

function Admin(): (
  target: object,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<unknown>
) => void {
  return applyDecorators(Roles(UserRole.ADMIN), UseGuards(JwtAuthGuard, RolesGuard))
}

export default Admin

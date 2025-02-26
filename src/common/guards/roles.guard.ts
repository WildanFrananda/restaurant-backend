import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type UserRole from "src/domain/enums/user-role.enum"
import { ROLES_KEY } from "../decorators/roles.decorator"

@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles) {
      return true
    }
    const request = context.switchToHttp().getRequest<{ user: { roles: UserRole[] } }>()
    const user = request.user

    return requiredRoles.some((role) => user.roles.includes(role))
  }
}

export default RolesGuard

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"

@Injectable()
class MockJwtAuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { userId: string; email: string; roles: string[] } }>()
    request.user = {
      userId: "test-user-id",
      email: "testuser",
      roles: ["user"]
    }

    return true
  }
}

export default MockJwtAuthGuard

import { ExecutionContext } from "@nestjs/common"

class MockJwtAuthGuard {
  public canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { userId: string; email: string; roles: string[] } }>()
    request.user = {
      userId: "testUserId",
      email: "testEmail",
      roles: ["user"]
    }

    return true
  }
}

export default MockJwtAuthGuard

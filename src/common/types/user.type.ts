import { Request } from "express"

interface AuthenticatedRequest extends Request {
  user: {
    userId: string
    email: string
    roles: string[]
  }
}

export default AuthenticatedRequest

import { IsEmail, MinLength } from "class-validator"

class LoginDTO {
  @IsEmail()
  email: string

  @MinLength(8)
  password: string
}

export default LoginDTO

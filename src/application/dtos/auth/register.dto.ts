import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

class RegisterDTO {
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @MinLength(8)
  password: string
}

export default RegisterDTO

import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class LoginDto {
  @ApiProperty({
    description: "Email пользователя.",
    example: "user@example.com",
  })
  @IsString()
  email: string

  @ApiProperty({
    description: "Пароль пользователя. Должен быть не короче 6 символов.",
    example: "securepassword123",
  })
  @IsString()
  password: string
}

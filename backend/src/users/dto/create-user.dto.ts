import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty({
    description: "Email пользователя. Должен быть уникальным.",
    example: "user@example.com",
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: "Имя пользователя.",
    example: "John",
  })
  @IsString()
  firstName: string

  @ApiProperty({
    description: "Фамилия пользователя.",
    example: "Doe",
  })
  @IsString()
  lastName: string

  @ApiProperty({
    description: "Телефон пользователя.",
    example: "+1234567890",
  })
  @IsString()
  phone: string

  @ApiProperty({
    description: "Аватар пользователя (опционально). Путь к изображению.",
    example: "/uploads/avatar.jpg",
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar: string

  @ApiProperty({
    description: "Дата рождения пользователя в формате YYYY-MM-DD.",
    example: "1990-01-01",
  })
  @IsString()
  birthDate: string

  @ApiProperty({
    description: "О себе (опционально). Максимум 250 символов.",
    example: "I am a software developer passionate about NestJS.",
    required: false,
  })
  @IsString()
  @MaxLength(250)
  @IsOptional()
  about: string

  @ApiProperty({
    description: "Пароль пользователя. Должен быть не короче 6 символов.",
    example: "securepassword123",
  })
  @IsString()
  @MinLength(6)
  password: string
}

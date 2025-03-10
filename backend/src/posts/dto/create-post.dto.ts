import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"

export class CreatePostDto {
  @ApiProperty({
    description: "Текст поста",
    example: "Сегодня отличный день!",
  })
  @IsString()
  text: string

  @ApiProperty({
    description: "ID пользователя",
    example: "1",
  })
  @IsNumber()
  userId: number

  @ApiPropertyOptional({
    description: "Список изображений (URL-адреса)",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  images?: string[]
}

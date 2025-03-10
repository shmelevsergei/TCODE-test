import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { AuthGuard } from "@nestjs/passport"
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger"
import { FileInterceptor } from "@nestjs/platform-express"
import { createMulterStorage } from "src/images/storage"
import { User } from "./entities/user.entity"

const storage = createMulterStorage()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Создать нового пользователя" })
  @ApiResponse({ status: 201, description: "Пользователь успешно создан" })
  @ApiResponse({ status: 400, description: "Некорректные данные пользователя" })
  @ApiBody({ type: CreateUserDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Получить всех пользователей" })
  @ApiResponse({ status: 200, description: "Список пользователей" })
  findAll() {
    return this.usersService.findAll()
  }

  @Get("search")
  @ApiOperation({ summary: "Получить пользователя по email" })
  @ApiResponse({ status: 200, description: "Пользователь найден" })
  @ApiResponse({ status: 404, description: "Пользователь не найден" })
  @ApiParam({ name: "email", description: "Email пользователя" })
  async findByEmail(@Query("email") email: string) {
    const user = await this.usersService.findOneByEmail(email)
    if (!user) {
      throw new NotFoundException("Пользователь не найден")
    }
    return user
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить пользователя по ID" })
  @ApiResponse({ status: 200, description: "Пользователь найден" })
  @ApiResponse({ status: 404, description: "Пользователь не найден" })
  @ApiParam({ name: "id", description: "ID пользователя" })
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(+id)
    if (!user) {
      throw new NotFoundException("Пользователь не найден")
    }
    return user
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Обновить данные пользователя" })
  @ApiResponse({ status: 200, description: "Пользователь обновлен" })
  @ApiResponse({ status: 404, description: "Пользователь не найден" })
  @ApiParam({ name: "id", description: "ID пользователя" })
  @ApiBody({ type: UpdateUserDto })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Удалить пользователя" })
  @ApiResponse({ status: 200, description: "Пользователь удалён" })
  @ApiResponse({ status: 404, description: "Пользователь не найден" })
  @ApiParam({ name: "id", description: "ID пользователя" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id)
  }

  @Post(":userId/avatar")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file", { storage }))
  @ApiOperation({ summary: "Загрузить аватар пользователя" })
  @ApiResponse({ status: 200, description: "Аватар успешно загружен" })
  @ApiResponse({ status: 404, description: "Пользователь не найден" })
  uploadAvatar(
    @Param("userId") userId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.uploadAvatar(userId, file)
  }
}

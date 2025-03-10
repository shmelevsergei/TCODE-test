import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { ImagesService } from "src/images/images.service"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private imagesService: ImagesService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const existingUser = await this.findOneByEmail(createUserDto.email)

    if (existingUser) {
      throw new ConflictException("Пользователь с таким email уже существует")
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })
    return this.usersRepository.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } })
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.usersRepository.update(id, updateUserDto)
    return this.usersRepository.findOne({ where: { id } })
  }

  async remove(id: number) {
    return this.usersRepository.delete(id)
  }

  async uploadAvatar(userId: number, file: Express.Multer.File): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException("Пользователь не найден")
    }

    const avatarPath = await this.imagesService.uploadImage(file)

    user.avatar = avatarPath

    return this.usersRepository.save(user)
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    if (!userId) {
      throw new Error("userId не может быть пустым!")
    }
    await this.usersRepository.update(userId, { refreshToken })
  }
}

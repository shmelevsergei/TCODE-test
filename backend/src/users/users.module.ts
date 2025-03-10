import { Module } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UsersController } from "./users.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { Post } from "src/posts/entities/post.entity"
import { ImagesModule } from "src/images/images.module"

@Module({
  imports: [TypeOrmModule.forFeature([User, Post]), ImagesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

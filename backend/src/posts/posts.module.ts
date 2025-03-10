import { Module } from "@nestjs/common"
import { PostsService } from "./posts.service"
import { PostsController } from "./posts.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Post } from "./entities/post.entity"
import { ImagesModule } from "src/images/images.module"
import { UsersModule } from "src/users/users.module"
import { User } from "src/users/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), ImagesModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

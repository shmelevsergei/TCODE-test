import { Module } from "@nestjs/common"

import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./users/entities/user.entity"
import { Post } from "./posts/entities/post.entity"
import { UsersController } from "./users/users.controller"

import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { AuthController } from "./auth/auth.controller"
import { ConfigModule } from "@nestjs/config"
import { ImagesModule } from "./images/images.module"
import { PostsModule } from "./posts/posts.module"
import { ServeStaticModule } from "@nestjs/serve-static"
import * as path from "path"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "db",
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Post],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),
    AuthModule,
    UsersModule,
    ImagesModule,
    PostsModule,
  ],
  controllers: [UsersController, AuthController],
})
export class AppModule {}

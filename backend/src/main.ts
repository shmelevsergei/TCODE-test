import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.enableCors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Accept",
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle("API документация")
    .setDescription("Описание API")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("Users")
    .addTag("Posts")
    .addTag("Images")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()

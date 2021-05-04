import { NestFactory } from "@nestjs/core";
import dotenv from "dotenv";
import { AppModule } from "./app.module";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();

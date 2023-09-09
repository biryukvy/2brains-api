import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { helmetFixed } from './common/helmet-fixed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmetFixed);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.API_PORT);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();
import { PrismaClient } from '@prisma/client'
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { jwtMiddleware } from './middlewares/jwt.middleware';

const prisma = new PrismaClient();

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('MongoDb connection successful');


    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:4000'],
      credentials: true,
    });
    app.enableVersioning({
      type: VersioningType.URI,
    })
    app.use(cookieParser())
    app.use(jwtMiddleware)
    app.useGlobalPipes(new ValidationPipe())

    await app.listen(process.env.PORT || 5000);

    console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
  }
  catch (err) {
    console.log(err);
  }
}
bootstrap();

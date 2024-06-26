import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const config = app.get(ConfigService);
  const port = config.get('app.port');
  await app.listen(port, () =>
    console.log(`Server is running on port ${port}`),
  );
}
bootstrap();

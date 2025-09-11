import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that are not in the DTO
      forbidNonWhitelisted: true, // throw error if extra properties are sent
      transform: true, // automatically transform payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error starting app:', err);
  process.exit(1);
});

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MainLogger } from './common/loggers/main-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useLogger(new MainLogger());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  process.stdout.write(`\n\x1b[36mServer ready at ${port}\x1b[0m\n\n`);
}
bootstrap();

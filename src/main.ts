import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonLogger } from './common/loggers/winston.logger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Logger } from 'winston';
import { ExceptionLoggingInterceptor } from './common/interceptors/exception-logging.interceptor';

const logger: Logger = WinstonLogger.getInstance();

process.on('uncaughtException', (err, origin) => {
  logger.error(`Caught exception: ${err}\nException origin: ${origin}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled rejection, reason: ${reason}`);
  process.exit(1);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ExceptionLoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.info(`Server ready at ${port}`);
}
bootstrap();

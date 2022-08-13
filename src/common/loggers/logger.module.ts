import { Module } from '@nestjs/common';
import { MainLogger } from './main-logger.service';

@Module({
  providers: [MainLogger],
  exports: [MainLogger],
})
export class LoggerModule {}

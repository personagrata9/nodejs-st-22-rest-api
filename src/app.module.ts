import 'dotenv/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { GroupsController } from './groups/controllers/groups.controller';
import { UsersController } from './users/controllers/users.controller';
import { LoggerModule } from './common/loggers/logger.module';

@Module({
  imports: [
    UsersModule,
    GroupsModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      define: {
        timestamps: false,
      },
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    LoggerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController, GroupsController);
  }
}

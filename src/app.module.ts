import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/models/user.model';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'tyke.db.elephantsql.com',
      port: 5432,
      username: 'dsmcehjd',
      password: '4pWEHzBci925PfsoinzTbMQ_lHROzqJR',
      database: 'dsmcehjd',
      models: [User],
    }),
    UsersModule,
  ],
})
export class AppModule {}

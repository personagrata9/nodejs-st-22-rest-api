import 'dotenv/config';
import { Module } from '@nestjs/common';
import { InMemoryUsersRepository } from './repository/in-memory-users.repository';
import { SequelizeUsersRepository } from './repository/sequelize-users.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UsersRepository',
      useClass:
        process.env.NODE_ENV === 'test'
          ? InMemoryUsersRepository
          : SequelizeUsersRepository,
    },
  ],
})
export class UsersModule {}

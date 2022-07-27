import { Module } from '@nestjs/common';
import { InMemoryUsersRepository } from './repository/in-memory-users.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UsersRepository',
      useClass: InMemoryUsersRepository,
    },
  ],
})
export class UsersModule {}

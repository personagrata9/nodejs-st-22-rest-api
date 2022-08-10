import 'dotenv/config';
import { Module } from '@nestjs/common';
import { InMemoryUsersRepository } from './repository/in-memory-users.repository';
import { SequelizeUsersRepository } from './repository/sequelize-users.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserGroup } from 'src/groups/models/user-group.model.';

@Module({
  imports: [SequelizeModule.forFeature([User, UserGroup])],
  exports: ['UsersRepository'],
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

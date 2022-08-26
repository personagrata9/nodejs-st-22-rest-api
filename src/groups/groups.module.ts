import 'dotenv/config';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './models/group.model';
import { GroupsService } from './services/groups.service';
import { InMemoryGroupsRepository } from './repository/in-memory-groups.repository';
import { SequelizeGroupsRepository } from './repository/sequelize-groups.repository';
import { GroupsController } from './controllers/groups.controller';
import { UserGroup } from './models/user-group.model.';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Group, UserGroup]), UsersModule],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    {
      provide: 'GroupsRepository',
      useClass:
        process.env.NODE_ENV === 'test'
          ? InMemoryGroupsRepository
          : SequelizeGroupsRepository,
    },
  ],
})
export class GroupsModule {}

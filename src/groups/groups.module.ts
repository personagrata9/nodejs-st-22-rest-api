import 'dotenv/config';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './models/group.model';
import { GroupsService } from './services/groups.service';
import { InMemoryGroupsRepository } from './repository/in-memory-groups.repository';
import { SequelizeGroupsRepository } from './repository/sequelize-groups.repository';
import { GroupsController } from './controllers/groups.controller';

@Module({
  imports: [SequelizeModule.forFeature([Group])],
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

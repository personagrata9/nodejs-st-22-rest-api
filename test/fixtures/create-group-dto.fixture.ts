import { CreateGroupDto } from 'src/groups/dto/create-group.dto';

export const createGroupDto: CreateGroupDto = {
  name: 'group',
  permissions: ['READ', 'WRITE'],
};

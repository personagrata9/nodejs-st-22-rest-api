import { UpdateGroupDto } from 'src/groups/dto/update-group.dto';

export const updateGroupDto: UpdateGroupDto = {
  name: 'group_upd',
  permissions: ['READ', 'WRITE', 'DELETE'],
};

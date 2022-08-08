import {
  IsDefined,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class AddUsersToGroupDto {
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @IsDefined({ message: '$property is required' })
  userIds: string[];
}

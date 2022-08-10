import {
  IsDefined,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsUUID,
} from 'class-validator';

export class AddUsersToGroupDto {
  @IsUUID('4', { each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @IsDefined({ message: '$property is required' })
  userIds: string[];
}

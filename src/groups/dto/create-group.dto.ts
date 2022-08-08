import {
  IsString,
  IsNotEmpty,
  IsDefined,
  IsArray,
  IsEnum,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';
import { Permission, PermissionType } from '../interfaces/group.interface';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined({ message: '$property is required' })
  name: string;

  @IsEnum(Permission, {
    each: true,
    message: `only the following permissions can be set: ${Object.values(
      Permission,
    ).join(', ')}`,
  })
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @IsDefined({ message: '$property is required' })
  permissions: PermissionType[];
}

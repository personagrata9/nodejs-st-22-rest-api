import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['login'] as const) {
  @IsString()
  @IsNotEmpty()
  @IsDefined({ message: '$property is required' })
  login: string;
}

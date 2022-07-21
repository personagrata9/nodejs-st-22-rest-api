import {
  IsString,
  IsInt,
  IsBoolean,
  IsNotEmpty,
  IsDefined,
  Min,
  Max,
} from 'class-validator';
import { HasLetter } from '../validation/decorators/has-letter.decorator';
import { HasNumber } from '../validation/decorators/has-number.decorator';
import { IsLoginAlreadyExist } from '../validation/decorators/is-login-already-exist.decorator';

export class CreateUserDto {
  @IsLoginAlreadyExist()
  @IsString()
  @IsNotEmpty()
  @IsDefined({ message: '$property is required' })
  login: string;

  @HasNumber('password')
  @HasLetter('password')
  @IsString()
  @IsDefined({ message: '$property is required' })
  password: string;

  @Max(130)
  @Min(4)
  @IsInt()
  @IsDefined({ message: '$property is required' })
  age: number;

  @IsBoolean()
  @IsDefined({ message: '$property is required' })
  isDeleted: boolean;
}

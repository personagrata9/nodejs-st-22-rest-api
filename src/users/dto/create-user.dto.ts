import { IsString, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { HasLetter } from '../validation-decorators/has-letter.decorator';
import { HasNumber } from '../validation-decorators/has-number.decorator';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  @HasLetter('password', {
    message: 'password must contain at least one letter',
  })
  @HasNumber('password', {
    message: 'password must contain at least one number',
  })
  password: string;

  @IsInt()
  @Min(4)
  @Max(130)
  age: number;

  @IsBoolean()
  isDeleted: boolean;
}

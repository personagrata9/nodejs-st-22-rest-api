import { IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsInt()
  age: number;

  @IsBoolean()
  isDeleted: boolean;
}

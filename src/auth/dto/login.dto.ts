import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined({ message: '$property is required' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined({ message: '$property is required' })
  password: string;
}

import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { Role } from '../../../common/types';

export class SignupDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsIn(['Student', 'Professor', 'Admin'])
  role: Role;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}

import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}

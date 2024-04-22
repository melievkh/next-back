import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from 'src/schemas';

export class RegisterAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(UserRole)
  role: UserRole;
}

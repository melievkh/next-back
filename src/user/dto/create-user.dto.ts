import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  telegram_id: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @Matches(/^\+998\d{9}$/, { message: 'Phone number is not valid' })
  phone_number: string;
}

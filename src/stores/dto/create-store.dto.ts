import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
  IsEnum,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export enum StoreCategory {
  OUTFITS = 'outfits',
  OTHER = 'other',
}

export enum StoreRole {
  ADMIN = 'admin',
  STORE = 'store',
}

class CreateStoreDto {
  @IsOptional()
  address_id?: string;

  @IsArray()
  category: StoreCategory[];

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  photo_url?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: 'Phone number is not valid' })
  phone_number1: string;

  @IsOptional()
  @Matches(/^\+998\d{9}$/, { message: 'Phone number is not valid' })
  phone_number2: string;

  @IsEnum(StoreRole)
  role: StoreRole = StoreRole.STORE;

  @IsNotEmpty()
  @IsString()
  storename: string;
}

export default CreateStoreDto;

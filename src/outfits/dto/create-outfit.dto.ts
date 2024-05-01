import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ArrayUnique,
  ArrayMaxSize,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { OutfitCategory, OutfitColor, OutfitSize } from '../types/outfit.types';

export class CreateOutfitDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  brand: string;

  @IsNotEmpty()
  @IsEnum(OutfitCategory, { message: 'Invalid category' })
  category: OutfitCategory;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  code: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(OutfitColor, { message: 'Invalid color', each: true })
  colors: OutfitColor[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayMaxSize(5)
  image_urls: string[];

  @IsNotEmpty()
  @IsString()
  image_main: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsEnum(OutfitSize, { message: 'Invalid Size', each: true })
  sizes: OutfitSize[];
}

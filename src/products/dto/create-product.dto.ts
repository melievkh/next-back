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
} from 'class-validator';
import { ProductCategory } from 'src/schemas';

export class CreateProductDto {
  @IsNumber({}, { message: 'Code must be a number' })
  @IsNotEmpty({ message: 'Code is required' })
  code: number;

  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @IsString({ message: 'Brand must be a string' })
  @IsNotEmpty({ message: 'Brand is required' })
  @MaxLength(50, { message: 'Brand must not exceed 50 characters' })
  brand: string;

  @IsNotEmpty({ message: 'Images are required' })
  @ArrayNotEmpty({ message: 'Images array must not be empty' })
  @ArrayUnique({ message: 'Images array must contain unique URLs' })
  @ArrayMaxSize(5, { message: 'Maximum 5 images allowed' })
  images: string[];

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsNotEmpty({ message: 'Category is required' })
  @IsEnum(ProductCategory, { message: 'Invalid category' })
  category: ProductCategory;

  @IsNotEmpty({ message: 'Size is required' })
  @ArrayNotEmpty({ message: 'Sizes array must not be empty' })
  @ArrayUnique({ message: 'Sizes array must contain unique sizes' })
  sizes: string[];

  @IsNotEmpty({ message: 'Color is required' })
  @ArrayNotEmpty({ message: 'Colors array must not be empty' })
  @ArrayUnique({ message: 'Colors array must contain unique colors' })
  colors: string[];
}

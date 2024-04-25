import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductCategory {
  SHOES = 'shoes',
  CLOTHES = 'clothes',
}

export enum ProductSize {
  MEDIUM = 'M',
  SMALL = 'S',
  XSMALL = 'XS',
  LARGE = 'L',
  XLARGE = 'XL',
  XXLARGE = 'XXL',
  S38 = '38',
  S39 = '39',
  S40 = '40',
  S41 = '41',
  S42 = '42',
  S43 = '43',
  S44 = '44',
  S45 = '45',
  S46 = '46',
}

export enum ProductColor {
  WHITE = 'white',
  BLACK = 'black',
  RED = 'red',
  BLUE = 'blue',
  GRAY = 'gray',
  GREEN = 'green',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  PURPLE = 'purple',
}

export enum ProductBrand {
  NIKE = 'Nike',
  ADIDAS = 'Adidas',
  REEBOK = 'Reebok',
}

@Schema()
export class Product {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ProductBrand })
  brand: ProductBrand;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  price: number;

  @Prop()
  description?: string;

  @Prop({ type: String, required: true, enum: ProductCategory })
  category: ProductCategory;

  @Prop({ type: [String], required: true, enum: ProductSize })
  sizes: ProductSize[];

  @Prop({ type: [String], required: true, enum: ProductColor })
  colors: ProductColor[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

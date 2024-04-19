import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductCategory {
  SHOES = 'shoes',
  CLOTHES = 'clothes',
}

@Schema()
export class Product {
  @Prop({ required: true, unique: true })
  code: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop()
  description?: string;

  @Prop({ type: String, required: true, enum: ProductCategory })
  category: ProductCategory;

  @Prop({ type: [String], required: true })
  sizes: string[];

  @Prop({ type: [String], required: true })
  colors: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

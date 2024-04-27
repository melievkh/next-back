import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Product, ProductColor, ProductSize } from './product.schema';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  order_by: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ enum: ProductColor })
  color?: ProductColor;

  @Prop({ enum: ProductSize })
  size?: ProductSize;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  deliver?: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

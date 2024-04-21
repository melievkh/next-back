import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema()
export class Order {
  @Prop({ required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  product_id: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop()
  color?: string;

  @Prop()
  size?: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop()
  deliver_id?: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

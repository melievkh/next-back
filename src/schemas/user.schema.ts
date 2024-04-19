import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role?: string;

  @Prop()
  telegram_id?: string;

  @Prop()
  first_name?: string;

  @Prop()
  username?: string;

  @Prop()
  phone_number?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: [UserRole], default: UserRole.USER })
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

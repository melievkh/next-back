import { IsMongoId, IsInt, Min, IsEnum, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { OrderStatus } from 'src/schemas/order.schema';

export class CreateOrderDto {
  @IsMongoId()
  product_id: Types.ObjectId;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  price: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;

  @IsOptional()
  color?: string;

  @IsOptional()
  size?: string;
}

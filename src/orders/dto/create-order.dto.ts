import { IsMongoId, IsInt, Min, IsEnum, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ProductColor, ProductSize } from 'src/db/schemas';
import { OrderStatus } from 'src/db/schemas/order.schema';

export class CreateOrderDto {
  @IsMongoId()
  order_by: Types.ObjectId;

  @IsMongoId()
  product: Types.ObjectId;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;

  @IsOptional()
  @IsEnum(ProductColor)
  color?: ProductColor;

  @IsOptional()
  @IsEnum(ProductSize)
  size?: ProductSize;
}

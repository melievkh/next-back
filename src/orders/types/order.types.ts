import { CreateOrderDto } from '../dto/create-order.dto';

export interface GetAllOrdersQuery {
  limit?: number;
  page?: number;
  filter?: CreateOrderDto;
}

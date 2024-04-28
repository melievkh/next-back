import { OrderStatus } from 'src/schemas';

export interface GetAllOrdersQuery {
  limit: number;
  page: number;
  status: OrderStatus;
  order_number: string;
}

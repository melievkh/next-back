import { OrderStatus } from 'src/db/schemas';

export interface GetAllOrdersQuery {
  limit: number;
  page: number;
  status: OrderStatus;
  order_number: string;
}

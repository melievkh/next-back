export enum OrderStatus {
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  PENDING = 'pending',
}

export interface GetAllOrdersQuery {
  limit: number;
  page: number;
  status: OrderStatus;
  order_number: number;
}

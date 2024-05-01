export enum OrderStatus {
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export interface GetStoreOrdersQuery {
  limit: number;
  page: number;
  status: OrderStatus;
  order_number: number;
}

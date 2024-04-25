import { CreateProductDto } from '../dto/create-product.dto';

export interface GetAllProductsQuery extends Partial<CreateProductDto> {
  limit?: number;
  page?: number;
}

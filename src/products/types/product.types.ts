import { CreateProductDto } from '../dto/create-product.dto';

export interface GetAllProductsQuery extends CreateProductDto {
  limit?: number;
  page?: number;
}

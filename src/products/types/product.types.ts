import { CreateProductDto } from '../dto/create-product.dto';

export interface GetAllProductsQuery {
  limit?: number;
  page?: number;
  filter?: CreateProductDto;
}

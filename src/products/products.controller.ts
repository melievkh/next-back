import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsQuery } from './types/product.types';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/decorators';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from 'src/auth/dto/register-admin.dto';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  getAll(@Query() query: GetAllProductsQuery) {
    return this.productsService.getAll(query);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}

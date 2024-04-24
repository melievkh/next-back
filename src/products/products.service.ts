import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsQuery } from './types/product.types';
import { Product, ProductDocument } from 'src/schemas';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const createdProduct = new this.productModel(createProductDto);
      await createdProduct.save();

      return { message: 'product successfully created', success: true };
    } catch (error) {
      throw new HttpException('Failed to create product', 500);
    }
  }

  async getAll(query: GetAllProductsQuery) {
    try {
      console.log(query);
      const { limit, page, ...filterOptions } = query;
      const productLimit = +limit || 10;
      const productPage = +page || 1;

      const totalItems = await this.productModel.countDocuments(filterOptions);

      const products = await this.productModel
        .find(filterOptions)
        .limit(productLimit)
        .skip((productPage - 1) * productLimit)
        .exec();

      if (products.length === 0 && productPage !== 1) {
        throw new NotFoundException('No products found on this page');
      }

      return { result: products, count: totalItems };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to get products', 500);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        { new: true },
      );
      if (!updatedProduct) throw new NotFoundException('Product not found');

      return { message: 'product successfully updated', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to update product', 500);
    }
  }

  async delete(id: string) {
    try {
      const productToDelete = await this.productModel.findByIdAndDelete(id);
      if (!productToDelete) throw new NotFoundException('Product not found');

      return { message: 'product successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to delete product', 500);
    }
  }
}

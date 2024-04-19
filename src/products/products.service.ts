import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
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
      return createdProduct.save();
    } catch (error) {
      throw new HttpException('Failed to create product', 400);
    }
  }

  async getAll() {
    try {
      const products = await this.productModel.find();
      if (products.length === 0)
        throw new NotFoundException('No products found');
      return products;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to get all products', 400);
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

      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to update product', 400);
    }
  }

  async delete(id: string) {
    try {
      const productToDelete = await this.productModel.findByIdAndDelete(id);
      if (!productToDelete) throw new NotFoundException('Product not found');

      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to delete product', 400);
    }
  }
}

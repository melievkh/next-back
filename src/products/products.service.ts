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
      throw new HttpException(
        `Failed to create product: ${error.message}`,
        500,
      );
    }
  }

  async getAll(query: GetAllProductsQuery) {
    try {
      const { limit, page, code, sizes, colors, ...filterOptions } = query;

      const productLimit = +limit || 10;
      const productPage = +page || 1;

      let sizesFilter = {};
      let colorsFilter = {};
      let codeFilter = {};

      if (sizes && sizes.length > 0) {
        sizesFilter = { sizes: { $in: sizes } };
      }
      if (colors && colors.length > 0) {
        colorsFilter = { colors: { $in: colors } };
      }
      if (code) {
        codeFilter = { code: { $regex: new RegExp(code, 'i') } };
      }

      const totalItems = await this.productModel.countDocuments({
        ...filterOptions,
        ...sizesFilter,
        ...colorsFilter,
        ...codeFilter,
      });

      const products = await this.productModel
        .find({
          ...filterOptions,
          ...sizesFilter,
          ...colorsFilter,
          ...codeFilter,
        })
        .limit(productLimit)
        .skip((productPage - 1) * productLimit)
        .exec();

      if (products.length === 0 && productPage !== 1) {
        throw new NotFoundException('No products found on this page');
      }

      return { result: products, count: totalItems };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to get products: ${error.message}`, 500);
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
      throw new HttpException(
        `Failed to update product: ${error.message}`,
        500,
      );
    }
  }

  async delete(id: string) {
    try {
      const productToDelete = await this.productModel.findByIdAndDelete(id);
      if (!productToDelete) throw new NotFoundException('Product not found');

      return { message: 'product successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Failed to delete product: ${error.message}`,
        500,
      );
    }
  }
}

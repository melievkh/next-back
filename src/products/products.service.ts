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
      const { limit, page, code, sizes, colors, brand, ...filterOptions } =
        query;

      const productLimit = +limit || 10;
      const productPage = +page || 1;

      let sizesFilter = {};
      let colorsFilter = {};
      let codeFilter = {};
      let brandFilter = {};

      if (sizes && sizes.length > 0) {
        sizesFilter = { sizes: { $in: sizes } };
      }
      if (colors && colors.length > 0) {
        colorsFilter = { colors: { $in: colors } };
      }
      if (code) {
        codeFilter = { code: { $regex: new RegExp(code, 'i') } };
      }
      if (brand) {
        brandFilter = { brand: { $regex: new RegExp(brand, 'i') } };
      }

      const totalItems = await this.productModel.countDocuments({
        ...filterOptions,
        ...sizesFilter,
        ...colorsFilter,
        ...codeFilter,
        ...brandFilter,
      });

      const products = await this.productModel
        .find({
          ...filterOptions,
          ...sizesFilter,
          ...colorsFilter,
          ...codeFilter,
          ...brandFilter,
        })
        .limit(productLimit)
        .skip((productPage - 1) * productLimit)
        .exec();

      if (products.length === 0 && productPage !== 1) {
        throw new NotFoundException('No products found on this page');
      }

      return { result: products, count: totalItems };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to get products: ${error.message}`, 500);
    }
  }

  async getOne(_id: string) {
    try {
      const product = await this.productModel.findOne({ _id });
      if (!product) throw new NotFoundException('Product not found');

      return { result: product, success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to get product: ${error.message}`, 500);
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

  async delete(ids: string[]) {
    try {
      if (ids.length === 0)
        throw new NotFoundException('No products to delete');

      await this.productModel.deleteMany({
        _id: { $in: ids },
      });

      return { message: 'product successfully deleted', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        `Failed to delete product: ${error.message}`,
        500,
      );
    }
  }
}

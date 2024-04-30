import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from 'src/db/schemas';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UserModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtService],
  exports: [ProductsService],
})
export class ProductsModule {}

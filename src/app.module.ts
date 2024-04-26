import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import appConfig from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [appConfig],
    }),
    MongooseModule.forRoot(
      'mongodb+srv://khushnudmeliev:melievkh@cluster0.a5ld2la.mongodb.net/next_db?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}

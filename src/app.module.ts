import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import appConfig from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { OutfitsModule } from './outfits/outfits.module';
import { StoreModule } from './stores/store.module';
import { UserModule } from './user/user.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [appConfig],
    }),
    CacheModule.register(redisConfig),
    OutfitsModule,
    OrdersModule,
    StoreModule,
    UserModule,
    FileUploadModule,
  ],
})
export class AppModule {}

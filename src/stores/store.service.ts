import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateStoreDto from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Role } from 'src/user/types/user.types';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class StoreService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getStores(query: any, admin_id: string) {
    try {
      const cacheKey = JSON.stringify(query);

      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) return cachedData;

      const { limit = 10, page = 1, storename, available } = query;

      let where: any = {};

      if (storename) {
        where = {
          ...where,
          storename: { contains: storename, mode: 'insensitive' },
        };
      }
      if (available)
        where = {
          ...where,
          available: { equals: available === 'true' ? true : false },
        };

      where.id = { not: { equals: admin_id } };

      const totalItems = await this.prismaService.store.count({ where });

      const stores = await this.prismaService.store.findMany({
        where,
        take: +limit,
        skip: (+page - 1) * +limit,
      });

      await this.cacheManager.set(cacheKey, {
        result: stores,
        count: totalItems,
      });

      return { result: stores, count: totalItems };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to get stores', 500);
    }
  }

  async getStore(id: string) {
    const store = await this.getStoreById(id);
    if (!store) throw new NotFoundException('Store not found');

    return { result: store, success: true };
  }

  async getStoreById(id: string) {
    const store = await this.prismaService.store.findUnique({ where: { id } });

    return store;
  }

  async getStoreRoleById(id: string) {
    const store = await this.getStoreById(id);
    if (!store) throw new NotFoundException('User not found');

    return store.role;
  }

  async getStoreByEmail(email: string) {
    const store = await this.prismaService.store.findUnique({
      where: { email },
    });
    return store;
  }

  async createStore(createStoreDto: CreateStoreDto) {
    try {
      const store = await this.getStoreByEmail(createStoreDto.email);
      if (store) throw new BadRequestException('Store already exists');

      const hashedPassword = await bcrypt.hash(createStoreDto.password, 10);
      await this.prismaService.store.create({
        data: {
          password: hashedPassword,
          storename: createStoreDto.storename,
          email: createStoreDto.email,
          phone_number1: createStoreDto.phone_number1,
          phone_number2: createStoreDto?.phone_number2,
          category: createStoreDto.category,
          role: Role.STORE,
        },
      });

      return { message: 'store created successfully', success: true };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new HttpException('Failed to register store', 500);
    }
  }

  async updateStore(id: string, updateStoreDto: UpdateStoreDto) {
    try {
      const store = await this.getStoreById(id);
      if (!store) throw new NotFoundException('Store not found');

      const updatedStore = await this.prismaService.store.update({
        where: { id },
        data: updateStoreDto,
      });

      return { result: updatedStore, success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to update store', 500);
    }
  }

  async changePassword(store_id: string, changePasswordDto: ChangePasswordDto) {
    try {
      const store = await this.getStoreById(store_id);
      if (!store) throw new NotFoundException('Store not found');

      const isMatch = await bcrypt.compare(
        changePasswordDto.oldPassword,
        store.password,
      );
      if (!isMatch)
        throw new BadRequestException('Old password does not match');

      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );

      await this.prismaService.store.update({
        where: { id: store_id },
        data: { password: hashedPassword },
        select: {
          password: true,
        },
      });

      return { message: 'password changed successfully', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new HttpException('Failed to change password', 500);
    }
  }

  async deleteStore(id: string) {
    try {
      const store = await this.getStoreById(id);
      if (!store) throw new NotFoundException('Store not found');

      await this.prismaService.store.delete({ where: { id } });
      return { message: 'store deleted!', success: true };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to delete store', 500);
    }
  }
}

import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateStoreDto from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Role } from 'src/user/types/user.types';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStores(query: any) {
    try {
      console.log(query);
      const { limit = 10, page = 1, storename, available } = query;

      let where = {};

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

      const totalItems = await this.prismaService.store.count({ where });

      const stores = await this.prismaService.store.findMany({
        where,
        take: +limit,
        skip: (+page - 1) * +limit,
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

  async getMe(id: string) {
    try {
      const store = await this.getStoreById(id);
      if (!store) throw new NotFoundException('Store not found');

      return { result: store, success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to get store', 500);
    }
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
          phone_number: createStoreDto.phone_number,
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

  async removeStore(id: string) {
    try {
      const store = await this.getStoreById(id);
      if (!store) throw new NotFoundException('Store not found');

      await this.prismaService.store.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to delete store', 500);
    }
  }
}

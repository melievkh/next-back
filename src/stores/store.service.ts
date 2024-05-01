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

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStores() {
    try {
      const stores = await this.prismaService.store.findMany();
      if (!stores) throw new NotFoundException('No stores found');

      return { result: stores, count: stores.length };
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
      const createdStore = await this.prismaService.store.create({
        data: {
          password: hashedPassword,
          storename: createStoreDto.storename,
          email: createStoreDto.email,
          phone_number: createStoreDto.phone_number,
          category: createStoreDto.category,
        },
      });

      return { result: createdStore, success: true };
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

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers() {
    const users = await this.prismaService.users.findMany();

    return { result: users, count: users.length };
  }

  async getUserById(id: string) {
    const user = await this.prismaService.users.findUnique({ where: { id } });
    return user;
  }

  async getUser(id: string) {
    try {
      const user = await this.prismaService.users.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      return { result: user, success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to get user: ${error.message}`, 500);
    }
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.prismaService.users.delete({ where: { id } });

    return { message: 'user successfully successfully', success: true };
  }
}

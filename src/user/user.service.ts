import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { RegisterAdminDto } from '../auth/dto/register-admin.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getAll() {
    return await this.userModel.find().exec();
  }

  async getMe(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) throw new NotFoundException('User not found');

      return { result: user, success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to get user', 500);
    }
  }

  async getUserRoleById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user.role;
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async registerAdmin(user: RegisterAdminDto) {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async createUser(user: CreateUserDto) {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) throw new NotFoundException('User not found');

    return { message: 'user successfully successfully', success: true };
  }
}

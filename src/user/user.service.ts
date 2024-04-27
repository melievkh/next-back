import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { RegisterAdminDto } from '../auth/dto/register-admin.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getAll() {
    const users = await this.userModel.find().exec();

    return { result: users, count: users.length };
  }

  async getMe(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) throw new NotFoundException('User not found');

      return { result: user, success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to get user: ${error.message}`, 500);
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

  async findUserById(id: Types.ObjectId) {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async registerAdmin(user: RegisterAdminDto) {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async createUser(user: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({
        telegram_id: user.telegram_id,
      });
      if (existingUser) throw new NotFoundException('User already exists');

      const userToCreate = new this.userModel(user);
      const newUser = await userToCreate.save();

      return { result: newUser, success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to create user: ${error.message}`, 500);
    }
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) throw new NotFoundException('User not found');

    return { message: 'user successfully successfully', success: true };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterAdminDto } from '../auth/dto/register-admin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.userModel.find().exec();
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

  async registerAdmin(user: RegisterAdminDto) {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async createUser(user: CreateUserDto) {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async deleteUser(id: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) throw new NotFoundException('User not found');

    await this.userModel.deleteOne({ _id: id }).exec();
    return { message: 'User deleted successfully' };
  }
}

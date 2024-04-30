import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/db/schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async registerUser(body: RegisterAdminDto) {
    try {
      if (!body.email || !body.password)
        throw new BadRequestException('Provide credentials!');

      const user = await this.usersService.findUserByEmail(body.email);
      if (user) throw new BadRequestException('User already exists');
      const hashedPassword = await bcrypt.hash(body.password, 10);

      await this.usersService.registerAdmin({
        email: body.email,
        phone_number: body.phone_number,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      return { message: 'User created successfully', success: true };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new HttpException('Failed to register user', 500);
    }
  }

  async loginUser(body: LoginDto) {
    try {
      const user = await this.usersService.findUserByEmail(body.email);
      if (!user) throw new NotFoundException('User not found');

      const isMatch = await bcrypt.compare(body.password, user.password);
      if (!isMatch) throw new BadRequestException('Invalid password');

      const accessToken = await this.getToken(user._id.toHexString());
      return { accessToken, userId: user._id, userRole: user.role };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to login user', 500);
    }
  }

  async getToken(sub: string): Promise<string> {
    const jwtPayload = { sub };
    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
    });

    return accessToken;
  }
}

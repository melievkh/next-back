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
import { StoreService } from 'src/stores/store.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly storeService: StoreService,
  ) {}

  async login(body: LoginDto) {
    try {
      const store = await this.storeService.getStoreByEmail(body.email);
      if (!store) throw new NotFoundException('Store not found');

      const isMatch = await bcrypt.compare(body.password, store.password);
      if (!isMatch) throw new BadRequestException('Invalid password');

      const tokens = await this.getToken(store.id);
      return { tokens, userId: store.id, role: store.role };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to login', 500);
    }
  }

  async getToken(sub: string) {
    const jwtPayload = { sub };
    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
    });

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });

    return { accessToken, refreshToken };
  }
}

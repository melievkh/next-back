import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() body: RegisterAdminDto) {
    return this.authService.registerUser(body);
  }

  @Post('login')
  async loginUser(@Body() body: LoginDto) {
    return this.authService.loginUser(body);
  }
}

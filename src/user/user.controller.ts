import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { GetMe, Roles } from 'src/auth/decorators';
import { Role } from './types/user.types';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN, Role.STORE)
  @UseGuards(AccessTokenGuard)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@GetMe() id: string) {
    return this.userService.getUser(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}

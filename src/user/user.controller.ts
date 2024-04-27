import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { GetUser, Roles } from 'src/auth/decorators';
import { UserRole } from 'src/schemas';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@GetUser() id: string) {
    return this.userService.getMe(id);
  }

  @Post('create')
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}

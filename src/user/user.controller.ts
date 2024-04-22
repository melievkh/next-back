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
import { Roles } from 'src/auth/decorators';
import { UserRole } from 'src/schemas';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Post('create')
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}

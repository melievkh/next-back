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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserService } from './user.service';
import { UserRole } from 'src/auth/dto/register-admin.dto';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Post('create')
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}

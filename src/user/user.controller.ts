import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { GetMe, Roles } from 'src/auth/decorators';
import { Role } from './types/user.types';
import { UserService } from './user.service';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMIN)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@GetMe() id: string) {
    return this.userService.getUser(id);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import CreateStoreDto from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { GetMe, Roles } from 'src/auth/decorators';
import { Role } from 'src/user/types/user.types';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  getStores() {
    return this.storeService.getStores();
  }

  @Get('/one/:id')
  getStore(@Param('id') id: string) {
    return this.storeService.getStore(id);
  }

  @Roles(Role.STORE)
  @Get('/me')
  getMe(@GetMe() id: string) {
    return this.storeService.getMe(id);
  }

  @Post()
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Roles(Role.STORE)
  @Patch('/:id')
  updateStore(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.updateStore(id, updateStoreDto);
  }

  @Delete('/:id')
  removeStore(@Param('id') id: string) {
    return this.storeService.removeStore(id);
  }
}

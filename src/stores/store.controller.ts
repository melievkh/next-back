import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import CreateStoreDto from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { GetMe, Roles } from 'src/auth/decorators';
import { Role } from 'src/user/types/user.types';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STORE)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Roles(Role.ADMIN)
  @Get()
  getStores(@Query() query: any, @GetMe() admin_id: string) {
    return this.storeService.getStores(query, admin_id);
  }

  @Get(':id')
  getStore(@Param('id') id: string) {
    return this.storeService.getStore(id);
  }

  @Post()
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Patch('change-password/:id')
  changePassword(
    @Param('id') store_id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.storeService.changePassword(store_id, changePasswordDto);
  }

  @Patch('/:id')
  updateStore(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.updateStore(id, updateStoreDto);
  }

  @Delete('/:id')
  deleteStore(@Param('id') id: string) {
    return this.storeService.deleteStore(id);
  }
}

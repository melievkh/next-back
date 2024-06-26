import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { GetMe, Roles } from 'src/auth/decorators';
import { OutfitsService } from './outfits.service';
import { Role } from 'src/user/types/user.types';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { GetAllOutfitsQuery, GetStoreOutfitsQuery } from './types/outfit.types';
import { UpdateOutfitDto } from './dto/update-outfits.dto';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STORE)
@Controller('outfits')
export class OutfitsController {
  constructor(private readonly outfitsService: OutfitsService) {}

  @Roles(Role.ADMIN)
  @Get(':all')
  getAllOutfits(@Query() query: GetAllOutfitsQuery) {
    return this.outfitsService.getAllOutfits(query);
  }

  @Get()
  getStoreOutfits(
    @GetMe() store_id: string,
    @Query() query: GetStoreOutfitsQuery,
  ) {
    return this.outfitsService.getStoreOutfits(store_id, query);
  }

  @Get('/one/:id')
  getStoreOutfitById(@Param('id') id: string) {
    return this.outfitsService.getSingleOutfitById(id);
  }

  @Post()
  create(@GetMe() store_id: string, @Body() createOutfitDto: CreateOutfitDto) {
    return this.outfitsService.createOutfit(store_id, createOutfitDto);
  }

  @Patch(':id')
  update(
    @Param('id') outfit_id: string,
    @GetMe() store_id: string,
    @Body() updateOutfitDto: UpdateOutfitDto,
  ) {
    return this.outfitsService.updateOutfit(
      outfit_id,
      store_id,
      updateOutfitDto,
    );
  }

  @Post('delete')
  delete(@Body() outfit_ids: string[], @GetMe() store_id: string) {
    return this.outfitsService.deleteOutfit(outfit_ids, store_id);
  }

  @Post('delete-image')
  deleteOutfitImage(
    @Body()
    { store_id, outfit_id, image_url }: any,
  ) {
    return this.outfitsService.deleteOutfitImage(
      store_id,
      outfit_id,
      image_url,
    );
  }
}

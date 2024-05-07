import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { GetAllOutfitsQuery, GetStoreOutfitsQuery } from './types/outfit.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOutfitDto } from './dto/update-outfits.dto';

@Injectable()
export class OutfitsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllOutfits(query: GetAllOutfitsQuery) {
    return this.getFilteredOutfits(query, {});
  }

  async getStoreOutfits(store_id: string, query: GetStoreOutfitsQuery) {
    return this.getFilteredOutfits(query, { store: { id: store_id } });
  }

  private async getFilteredOutfits(query: any, additionalWhere: any) {
    try {
      const {
        limit = 10,
        page = 1,
        code,
        sizes,
        colors,
        brand,
        category,
      } = query;

      const outfitLimit = +limit;
      const outfitPage = +page;

      let where: any = additionalWhere;

      if (sizes && sizes.length > 0) {
        where = { ...where, sizes: { hasSome: sizes } };
      }
      if (colors && colors.length > 0) {
        where = { ...where, colors: { hasSome: colors } };
      }
      if (code) {
        where = { ...where, code: { contains: code, mode: 'insensitive' } };
      }
      if (brand) {
        where = { ...where, brand: { contains: brand, mode: 'insensitive' } };
      }
      if (category) {
        where = { ...where, category: { equals: category } };
      }

      const totalItems = await this.prismaService.outfits.count({ where });
      const outfits = await this.prismaService.outfits.findMany({
        where,
        take: outfitLimit,
        skip: (outfitPage - 1) * outfitLimit,
      });

      if (outfits.length === 0 && outfitPage !== 1) {
        throw new NotFoundException('No outfits found on this page');
      }

      console.log(outfits);
      return { result: outfits, count: totalItems };
    } catch (error) {
      throw new HttpException('Failed to get outfits', 500);
    }
  }

  async getSingleOutfitById(id: string) {
    try {
      const outfit = await this.prismaService.outfits.findUnique({
        where: { id },
      });
      if (!outfit) throw new NotFoundException('Outfit not found');

      return { result: outfit, success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to get outfit', 500);
    }
  }

  async createOutfit(store_id: string, createOutfitDto: CreateOutfitDto) {
    try {
      const existingOutfit = await this.getOutfitByCode(
        createOutfitDto.code,
        store_id,
      );
      if (existingOutfit)
        throw new BadRequestException('Outfit already exists with this code');

      await this.prismaService.outfits.create({
        data: {
          ...createOutfitDto,
          store: {
            connect: {
              id: store_id,
            },
          },
        },
      });

      return { message: 'Outfit created successfully', success: true };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new HttpException('Failed to create outfit', 500);
    }
  }

  async updateOutfit(
    outfit_id: string,
    store_id: string,
    updateOutfitDto: UpdateOutfitDto,
  ) {
    try {
      const outfit = await this.getStoreOutfitById(outfit_id, store_id);
      if (!outfit) throw new NotFoundException('Outfit not found');

      await this.prismaService.outfits.update({
        where: { id: outfit_id },
        data: {
          ...updateOutfitDto,
          store: {
            connect: {
              id: store_id,
            },
          },
        },
      });

      return { message: 'Outfit updated successfully', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to update outfit', 500);
    }
  }

  async deleteOutfit(outfit_ids: string[], store_id: string) {
    try {
      const outfits = await this.prismaService.outfits.findMany({
        where: {
          id: { in: outfit_ids },
          store: { id: store_id },
        },
      });
      if (outfits.length !== outfit_ids.length)
        throw new NotFoundException('No outfits found');

      await this.prismaService.outfits.deleteMany({
        where: { id: { in: outfit_ids } },
      });
      return { message: 'Outfit deleted successfully', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to delete outfit', 500);
    }
  }

  async deleteOutfitImage(
    store_id: string,
    outfit_id: string,
    image_url: string,
  ) {
    try {
      const outfit = await this.getStoreOutfitById(outfit_id, store_id);
      if (!outfit) throw new NotFoundException('Outfit not found');

      if (outfit.image_urls.length <= 1)
        throw new BadRequestException('Outfit must have at least one image');

      const index = outfit.image_urls.indexOf(image_url);
      if (index === -1) throw new NotFoundException('Image not found');

      outfit.image_urls.splice(index, 1);
      await this.prismaService.outfits.update({
        where: { id: outfit_id },
        data: { image_urls: { set: outfit.image_urls } },
      });

      return { message: 'Image deleted successfully', success: true };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to delete image', 500);
    }
  }

  async getStoreOutfitById(id: string, store_id: string) {
    const outfit = await this.prismaService.outfits.findFirst({
      where: { id, store: { id: store_id } },
    });

    return outfit;
  }

  async getOutfitByCode(code: string, store_id: string) {
    const outfit = await this.prismaService.outfits.findFirst({
      where: { code, store: { id: store_id } },
    });

    return outfit;
  }
}

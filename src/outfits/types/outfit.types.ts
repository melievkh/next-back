import { CreateOutfitDto } from '../dto/create-outfit.dto';

export interface GetAllProductsQuery extends Partial<CreateOutfitDto> {
  limit?: number;
  page?: number;
}

export enum OutfitCategory {
  CAPS = 'caps',
  PANTS = 'pants',
  SHOES = 'shoes',
  T_SHIRTS = 't_shirts',
  OTHER = 'other',
}

export enum OutfitColor {
  WHITE = 'white',
  BLACK = 'black',
  RED = 'red',
  BLUE = 'blue',
  GRAY = 'gray',
  GREEN = 'green',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  PURPLE = 'purple',
}

export enum OutfitSize {
  MEDIUM = 'M',
  SMALL = 'S',
  XSMALL = 'XS',
  LARGE = 'L',
  XLARGE = 'XL',
  XXLARGE = 'XXL',
  S38 = '38',
  S39 = '39',
  S40 = '40',
  S41 = '41',
  S42 = '42',
  S43 = '43',
  S44 = '44',
  S45 = '45',
  S46 = '46',
}

export interface GetAllOutfitsQuery {
  limit?: number;
  page?: number;
  category?: OutfitCategory;
  colors?: OutfitColor;
  sizes?: OutfitSize;
  brand?: string;
  code?: string;
}

export interface GetStoreOutfitsQuery extends GetAllOutfitsQuery {}

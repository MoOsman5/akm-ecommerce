import {
  IsString, IsNumber, IsOptional, IsBoolean,
  IsArray, ValidateNested, Min, IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class ProductVariantDto {
  @ApiProperty() @IsString() color: string;
  @ApiProperty() @IsString() size: string;
  @ApiProperty() @IsNumber() @Min(0) stock: number;
  @ApiProperty() @IsString() sku: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Min(0) priceAdjustment?: number;
}

export class CreateProductDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() description: string;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Min(0) compareAtPrice?: number;
  @ApiProperty() @IsString() category: string;
  @ApiPropertyOptional({ type: [ProductVariantDto] })
  @IsArray() @IsOptional()
  @ValidateNested({ each: true }) @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];
  @ApiPropertyOptional() @IsArray() @IsOptional() images?: string[];
  @ApiPropertyOptional() @IsArray() @IsOptional() colors?: string[];
  @ApiPropertyOptional() @IsArray() @IsOptional() sizes?: string[];
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isFeatured?: boolean;
  @ApiPropertyOptional() @IsArray() @IsOptional() tags?: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }

export class ProductQueryDto {
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
  @ApiPropertyOptional() @IsOptional() category?: string;
  @ApiPropertyOptional() @IsOptional() minPrice?: number;
  @ApiPropertyOptional() @IsOptional() maxPrice?: number;
  @ApiPropertyOptional() @IsOptional() color?: string;
  @ApiPropertyOptional() @IsOptional() size?: string;
  @ApiPropertyOptional() @IsOptional() sort?: string;
  @ApiPropertyOptional() @IsOptional() search?: string;
  @ApiPropertyOptional() @IsOptional() featured?: boolean;
}

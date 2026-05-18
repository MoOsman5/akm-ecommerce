import {
  IsString, IsNumber, IsOptional, IsBoolean,
  IsEnum, IsDate, IsNotEmpty, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DiscountType } from '../schemas/coupon.schema';

export class CreateCouponDto {
  @ApiProperty() @IsString() @IsNotEmpty() code: string;
  @ApiProperty({ enum: DiscountType }) @IsEnum(DiscountType) discountType: DiscountType;
  @ApiProperty() @IsNumber() @Min(0) discountValue: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Min(0) minPurchase?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() maxDiscount?: number;
  @ApiProperty() @IsNumber() @Min(1) maxUses: number;
  @ApiProperty() @Type(() => Date) @IsDate() expiresAt: Date;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive?: boolean;
}

export class UpdateCouponDto extends PartialType(CreateCouponDto) { }

export class ValidateCouponDto {
  @ApiProperty() @IsString() @IsNotEmpty() code: string;
  @ApiProperty() @IsNumber() @Min(0) subtotal: number;
}

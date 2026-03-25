import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty() @IsString() @IsNotEmpty() product: string;
  @ApiProperty() @IsString() @IsNotEmpty() color: string;
  @ApiProperty() @IsString() @IsNotEmpty() size: string;
  @ApiProperty() @IsNumber() @Min(1) quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty() @IsNumber() @Min(1) quantity: number;
}

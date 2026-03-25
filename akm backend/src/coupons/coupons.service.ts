import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from './schemas/coupon.schema';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
  ) { }

  async create(dto: CreateCouponDto) {
    return this.couponModel.create(dto);
  }

  async findAll() {
    return this.couponModel.find().sort({ createdAt: -1 });
  }

  async update(id: string, dto: UpdateCouponDto) {
    const coupon = await this.couponModel.findByIdAndUpdate(id, dto, { new: true });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async delete(id: string) {
    const result = await this.couponModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Coupon not found');
    return { message: 'Coupon deleted' };
  }

  async validate(dto: ValidateCouponDto) {
    const coupon = await this.couponModel.findOne({
      code: dto.code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
    if (!coupon) throw new BadRequestException('Invalid or expired coupon');
    if (coupon.usedCount >= coupon.maxUses) throw new BadRequestException('Coupon usage limit reached');
    if (dto.subtotal < coupon.minPurchase) throw new BadRequestException(`Minimum purchase of ${coupon.minPurchase} required`);

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (dto.subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else {
      discount = coupon.discountValue;
    }

    return { valid: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } };
  }
}

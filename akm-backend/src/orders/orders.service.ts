import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Coupon } from '../coupons/schemas/coupon.schema';
import { Product } from '../products/schemas/product.schema';
import { Cart } from '../cart/schemas/cart.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) { }

  async create(userId: string, dto: CreateOrderDto) {
    // Calculate totals
    let subtotal = 0;
    for (const item of dto.items) {
      subtotal += item.price * item.quantity;
    }

    let discount = 0;
    let couponId = undefined;

    // Apply coupon if provided
    if (dto.couponCode) {
      const coupon = await this.couponModel.findOne({
        code: dto.couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
      });
      if (!coupon) throw new BadRequestException('Invalid coupon code');
      if (coupon.usedCount >= coupon.maxUses) throw new BadRequestException('Coupon usage limit reached');
      if (subtotal < coupon.minPurchase) throw new BadRequestException(`Minimum purchase of ${coupon.minPurchase} required`);

      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
      couponId = coupon._id;
      coupon.usedCount += 1;
      await coupon.save();
    }

    const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping over 500
    const totalAmount = subtotal - discount + shippingCost;

    // Generate order number
    const orderNumber = `AKM-${Date.now().toString(36).toUpperCase()}`;

    const order = await this.orderModel.create({
      orderNumber,
      user: userId,
      items: dto.items,
      shippingAddress: dto.shippingAddress,
      subtotal,
      discount,
      shippingCost,
      totalAmount,
      coupon: couponId,
      notes: dto.notes,
    });

    // Update product stock and totalSold
    for (const item of dto.items) {
      await this.productModel.findOneAndUpdate(
        { _id: item.product, 'variants.color': item.color, 'variants.size': item.size },
        {
          $inc: {
            'variants.$.stock': -item.quantity,
            totalSold: item.quantity,
          },
        },
      );
    }

    // Clear user's cart
    await this.cartModel.findOneAndUpdate({ user: userId }, { items: [] });

    return order;
  }

  async findUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.orderModel.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.orderModel.countDocuments({ user: userId }),
    ]);
    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findAll(page = 1, limit = 20, status?: string) {
    const filter: any = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.orderModel.find(filter).populate('user', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.orderModel.countDocuments(filter),
    ]);
    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const order = await this.orderModel.findById(id).populate('user', 'firstName lastName email phone');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true },
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.orderModel.findOne({ _id: id, user: userId });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order cannot be cancelled');
    }
    order.status = OrderStatus.CANCELLED;
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await this.productModel.findOneAndUpdate(
        { _id: item.product, 'variants.color': item.color, 'variants.size': item.size },
        { $inc: { 'variants.$.stock': item.quantity, totalSold: -item.quantity } },
      );
    }

    return order;
  }
}

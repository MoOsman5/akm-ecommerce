import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from '../orders/schemas/order.schema';
import { Product } from '../products/schemas/product.schema';
import { User } from '../users/schemas/user.schema';
import { Banner } from './schemas/banner.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Banner.name) private bannerModel: Model<Banner>,
  ) { }

  async getDashboard() {
    const [
      totalOrders,
      totalSales,
      totalCustomers,
      recentOrders,
      bestSellers,
      ordersByStatus,
    ] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.aggregate([
        { $match: { status: { $ne: OrderStatus.CANCELLED } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      this.userModel.countDocuments({ role: 'user' }),
      this.orderModel
        .find()
        .populate('user', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(10),
      this.productModel.find().sort({ totalSold: -1 }).limit(5),
      this.orderModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    // Monthly sales for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySales = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: OrderStatus.CANCELLED },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      totalOrders,
      totalSales: totalSales[0]?.total || 0,
      totalCustomers,
      recentOrders,
      bestSellers,
      ordersByStatus,
      monthlySales,
    };
  }

  // Banner management
  async getBanners() {
    return this.bannerModel.find().sort({ sortOrder: 1 });
  }

  async getActiveBanners() {
    return this.bannerModel.find({ isActive: true }).sort({ sortOrder: 1 });
  }

  async createBanner(data: Partial<Banner>) {
    return this.bannerModel.create(data);
  }

  async updateBanner(id: string, data: Partial<Banner>) {
    return this.bannerModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBanner(id: string) {
    await this.bannerModel.findByIdAndDelete(id);
    return { message: 'Banner deleted' };
  }

  // Featured products management
  async updateFeaturedProducts(productIds: string[]) {
    await this.productModel.updateMany({}, { isFeatured: false });
    await this.productModel.updateMany(
      { _id: { $in: productIds } },
      { isFeatured: true },
    );
    return { message: 'Featured products updated' };
  }
}

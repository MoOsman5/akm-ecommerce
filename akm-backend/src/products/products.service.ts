import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { Product } from './schemas/product.schema';
import { Category } from '../categories/schemas/category.schema';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) { }

  async create(dto: CreateProductDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });
    // Ensure unique slug
    let uniqueSlug = slug;
    let count = 0;
    while (await this.productModel.findOne({ slug: uniqueSlug })) {
      count++;
      uniqueSlug = `${slug}-${count}`;
    }
    const categoryId = typeof dto.category === 'string' ? new Types.ObjectId(dto.category) : dto.category;
    return this.productModel.create({ ...dto, category: categoryId, slug: uniqueSlug });
  }

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 12, category, minPrice, maxPrice, color, size, sort, search, featured } = query;
    const filter: any = { isActive: true };

    if (category) {
      const categoryDoc = await this.categoryModel.findOne({ slug: category });
      if (categoryDoc) filter.category = categoryDoc._id;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
    if (color) filter.colors = { $in: [color] };
    if (size) filter.sizes = { $in: [size] };
    if (featured !== undefined) filter.isFeatured = featured;
    if (search) filter.$text = { $search: search };

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'popular') sortOption = { totalSold: -1 };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.productModel.find(filter).populate('category', 'name slug').sort(sortOption).skip(skip).limit(limit),
      this.productModel.countDocuments(filter),
    ]);

    return { products, total, page: Number(page), totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug, isActive: true }).populate('category', 'name slug');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).populate('category', 'name slug');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    if (dto.name) {
      (dto as any).slug = slugify(dto.name, { lower: true, strict: true });
    }
    const updateData = { ...dto };
    if (dto.category && typeof dto.category === 'string') {
      updateData.category = new Types.ObjectId(dto.category) as any;
    }
    const product = await this.productModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product deleted' };
  }

  async getFeatured() {
    return this.productModel.find({ isFeatured: true, isActive: true }).populate('category', 'name slug').limit(8);
  }

  async getNewArrivals() {
    return this.productModel.find({ isActive: true }).populate('category', 'name slug').sort({ createdAt: -1 }).limit(8);
  }

  async getRelated(productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) return [];
    return this.productModel
      .find({ category: product.category, _id: { $ne: productId }, isActive: true })
      .populate('category', 'name slug')
      .limit(4);
  }

  async updateFeatured(productIds: string[], isFeatured: boolean) {
    await this.productModel.updateMany(
      { _id: { $in: productIds } },
      { isFeatured },
    );
    return { message: 'Featured status updated' };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) { }

  async create(dto: CreateCategoryDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });
    return this.categoryModel.create({ ...dto, slug });
  }

  async findAll() {
    return this.categoryModel.find().sort({ sortOrder: 1, name: 1 });
  }

  async findActive() {
    return this.categoryModel.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
  }

  async findBySlug(slug: string) {
    const category = await this.categoryModel.findOne({ slug });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    if (dto.name) {
      (dto as any).slug = slugify(dto.name, { lower: true, strict: true });
    }
    const category = await this.categoryModel.findByIdAndUpdate(id, dto, { new: true });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async delete(id: string) {
    const result = await this.categoryModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Category not found');
    return { message: 'Category deleted' };
  }
}

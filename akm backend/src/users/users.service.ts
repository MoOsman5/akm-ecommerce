import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { Address } from './schemas/address.schema';
import { UpdateUserDto, ChangePasswordDto, CreateAddressDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) { }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      this.userModel.countDocuments(),
    ]);
    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(userId: string, updateDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, updateDto, {
      new: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new NotFoundException('Current password is incorrect');

    user.password = await bcrypt.hash(dto.newPassword, 12);
    await user.save();
    return { message: 'Password updated successfully' };
  }

  async toggleBlock(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.isBlocked = !user.isBlocked;
    await user.save();
    return user;
  }

  // Address methods
  async getAddresses(userId: string) {
    return this.addressModel.find({ user: userId }).sort({ isDefault: -1 });
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.addressModel.updateMany({ user: userId }, { isDefault: false });
    }
    return this.addressModel.create({ ...dto, user: userId });
  }

  async updateAddress(userId: string, addressId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.addressModel.updateMany({ user: userId }, { isDefault: false });
    }
    const address = await this.addressModel.findOneAndUpdate(
      { _id: addressId, user: userId },
      dto,
      { new: true },
    );
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async deleteAddress(userId: string, addressId: string) {
    const result = await this.addressModel.findOneAndDelete({
      _id: addressId,
      user: userId,
    });
    if (!result) throw new NotFoundException('Address not found');
    return { message: 'Address deleted' };
  }
}

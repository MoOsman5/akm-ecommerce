import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) { }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard analytics' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('banners')
  @ApiOperation({ summary: 'Get all banners' })
  getBanners() {
    return this.adminService.getBanners();
  }

  @Post('banners')
  @ApiOperation({ summary: 'Create a banner' })
  createBanner(@Body() data: any) {
    return this.adminService.createBanner(data);
  }

  @Patch('banners/:id')
  @ApiOperation({ summary: 'Update a banner' })
  updateBanner(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateBanner(id, data);
  }

  @Delete('banners/:id')
  @ApiOperation({ summary: 'Delete a banner' })
  deleteBanner(@Param('id') id: string) {
    return this.adminService.deleteBanner(id);
  }

  @Patch('featured-products')
  @ApiOperation({ summary: 'Update featured products' })
  updateFeaturedProducts(@Body() body: { productIds: string[] }) {
    return this.adminService.updateFeaturedProducts(body.productIds);
  }
}

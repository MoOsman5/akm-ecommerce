/* eslint-disable */
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/akm-ecommerce';

const UserSchema = new mongoose.Schema({
  firstName: String, lastName: String, email: String, password: String,
  phone: String, role: { type: String, default: 'user' }, isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String, slug: String, description: String, image: String,
  isActive: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String, slug: String, description: String, price: Number, compareAtPrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  variants: [{ color: String, size: String, stock: Number, sku: String, priceAdjustment: Number }],
  images: [String], colors: [String], sizes: [String],
  isFeatured: { type: Boolean, default: false }, isActive: { type: Boolean, default: true },
  totalSold: { type: Number, default: 0 }, averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }, tags: [String],
}, { timestamps: true });

const CouponSchema = new mongoose.Schema({
  code: String, discountType: String, discountValue: Number, minPurchase: Number,
  maxDiscount: Number, maxUses: Number, usedCount: { type: Number, default: 0 },
  expiresAt: Date, isActive: { type: Boolean, default: true }, description: String,
}, { timestamps: true });

const BannerSchema = new mongoose.Schema({
  title: String, subtitle: String, imageUrl: String, link: String,
  buttonText: String, isActive: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  orderNumber: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, image: String, color: String, size: String, quantity: Number, price: Number }],
  shippingAddress: { fullName: String, phone: String, street: String, city: String, state: String, zipCode: String },
  status: { type: String, default: 'pending' },
  subtotal: Number, discount: Number, shippingCost: Number, totalAmount: Number,
  paymentMethod: { type: String, default: 'cash_on_delivery' },
}, { timestamps: true });

async function seed() {
  console.log('🌱 Seeding AKM database...');
  await mongoose.connect(MONGODB_URI);
  console.log('📦 Connected to MongoDB');

  const User = mongoose.model('User', UserSchema);
  const Category = mongoose.model('Category', CategorySchema);
  const Product = mongoose.model('Product', ProductSchema);
  const Coupon = mongoose.model('Coupon', CouponSchema);
  const Banner = mongoose.model('Banner', BannerSchema);
  const Order = mongoose.model('Order', OrderSchema);

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}),
    Coupon.deleteMany({}), Banner.deleteMany({}), Order.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const userPassword = await bcrypt.hash('User123!', 12);

  const admin = await User.create({
    firstName: 'Admin', lastName: 'AKM', email: 'admin@akm.com',
    password: adminPassword, phone: '+1234567890', role: 'admin',
  });

  const customer = await User.create({
    firstName: 'Ahmed', lastName: 'Customer', email: 'customer@akm.com',
    password: userPassword, phone: '+1234567891', role: 'user',
  });
  console.log('👤 Created users');

  // Create categories
  const categories = await Category.insertMany([
    { name: 'T-Shirts', slug: 't-shirts', description: 'Premium cotton t-shirts for everyday style', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', sortOrder: 1 },
    { name: 'Hoodies', slug: 'hoodies', description: 'Comfortable hoodies for casual wear', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', sortOrder: 2 },
    { name: 'Pants', slug: 'pants', description: 'Stylish pants and trousers', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', sortOrder: 3 },
    { name: 'Jackets', slug: 'jackets', description: 'Trendy jackets for all seasons', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', sortOrder: 4 },
    { name: 'Accessories', slug: 'accessories', description: 'Complete your look with our accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400', sortOrder: 5 },
  ]);
  console.log('📁 Created categories');

  // Helper to generate variants
  const genVariants = (colors: string[], sizes: string[], baseStock = 25) =>
    colors.flatMap((color) =>
      sizes.map((size) => ({
        color, size, stock: baseStock + Math.floor(Math.random() * 20),
        sku: `AKM-${color.substring(0, 3).toUpperCase()}-${size}`,
        priceAdjustment: 0,
      }))
    );

  // Create products
  const products = await Product.insertMany([
    // T-Shirts
    { name: 'AKM Classic Logo Tee', slug: 'akm-classic-logo-tee', description: 'Our signature logo t-shirt made from 100% premium cotton. Comfortable fit with the iconic AKM branding.', price: 35, compareAtPrice: 45, category: categories[0]._id, variants: genVariants(['Black', 'White', 'Navy'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'], colors: ['Black', 'White', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], isFeatured: true, totalSold: 150, tags: ['classic', 'logo', 'cotton'] },
    { name: 'AKM Oversized Street Tee', slug: 'akm-oversized-street-tee', description: 'Oversized fit street-style t-shirt. Drop-shoulder design with bold AKM print on the back.', price: 42, compareAtPrice: 55, category: categories[0]._id, variants: genVariants(['Black', 'Olive', 'Sand'], ['M', 'L', 'XL', 'XXL']), images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'], colors: ['Black', 'Olive', 'Sand'], sizes: ['M', 'L', 'XL', 'XXL'], isFeatured: true, totalSold: 120, tags: ['oversized', 'street', 'trendy'] },
    { name: 'AKM Minimal V-Neck', slug: 'akm-minimal-v-neck', description: 'Minimalist v-neck tee for a clean, refined look. Soft blend fabric.', price: 30, category: categories[0]._id, variants: genVariants(['White', 'Gray', 'Black'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'], colors: ['White', 'Gray', 'Black'], sizes: ['S', 'M', 'L', 'XL'], totalSold: 85, tags: ['minimal', 'v-neck'] },
    { name: 'AKM Graphic Print Tee', slug: 'akm-graphic-print-tee', description: 'Bold graphic print tee featuring unique AKM artwork. Limited edition design.', price: 48, category: categories[0]._id, variants: genVariants(['Black', 'White'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'], colors: ['Black', 'White'], sizes: ['S', 'M', 'L', 'XL'], isFeatured: true, totalSold: 200, tags: ['graphic', 'limited'] },
    // Hoodies
    { name: 'AKM Essential Hoodie', slug: 'akm-essential-hoodie', description: 'Your everyday essential hoodie. Heavyweight fleece with kangaroo pocket and adjustable drawstring hood.', price: 75, compareAtPrice: 95, category: categories[1]._id, variants: genVariants(['Black', 'Gray', 'Navy'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'], colors: ['Black', 'Gray', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], isFeatured: true, totalSold: 180, tags: ['essential', 'hoodie', 'fleece'] },
    { name: 'AKM Zip-Up Track Hoodie', slug: 'akm-zip-up-track-hoodie', description: 'Full-zip track hoodie with contrast stripes. Perfect for layering.', price: 85, category: categories[1]._id, variants: genVariants(['Black', 'Charcoal'], ['M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600'], colors: ['Black', 'Charcoal'], sizes: ['M', 'L', 'XL'], totalSold: 95, tags: ['zip-up', 'track'] },
    { name: 'AKM Pullover Varsity Hoodie', slug: 'akm-pullover-varsity-hoodie', description: 'Varsity-inspired pullover hoodie with embroidered AKM patch.', price: 90, compareAtPrice: 110, category: categories[1]._id, variants: genVariants(['Forest Green', 'Burgundy', 'Black'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600'], colors: ['Forest Green', 'Burgundy', 'Black'], sizes: ['S', 'M', 'L', 'XL'], isFeatured: true, totalSold: 130, tags: ['varsity', 'embroidered'] },
    // Pants
    { name: 'AKM Cargo Joggers', slug: 'akm-cargo-joggers', description: 'Utility cargo joggers with multiple pockets. Elastic waistband and cuffed ankles.', price: 65, compareAtPrice: 80, category: categories[2]._id, variants: genVariants(['Black', 'Olive', 'Khaki'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'], colors: ['Black', 'Olive', 'Khaki'], sizes: ['S', 'M', 'L', 'XL'], isFeatured: true, totalSold: 110, tags: ['cargo', 'joggers', 'utility'] },
    { name: 'AKM Slim Chinos', slug: 'akm-slim-chinos', description: 'Slim-fit chinos with a modern tapered leg. Perfect for smart casual.', price: 58, category: categories[2]._id, variants: genVariants(['Black', 'Navy', 'Tan'], ['28', '30', '32', '34', '36']), images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'], colors: ['Black', 'Navy', 'Tan'], sizes: ['28', '30', '32', '34', '36'], totalSold: 75, tags: ['chinos', 'slim', 'smart'] },
    { name: 'AKM Relaxed Sweatpants', slug: 'akm-relaxed-sweatpants', description: 'Ultra-comfortable relaxed fit sweatpants. Brushed fleece interior.', price: 55, category: categories[2]._id, variants: genVariants(['Heather Gray', 'Black'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600'], colors: ['Heather Gray', 'Black'], sizes: ['S', 'M', 'L', 'XL'], totalSold: 60, tags: ['sweatpants', 'relaxed', 'comfort'] },
    // Jackets
    { name: 'AKM Bomber Jacket', slug: 'akm-bomber-jacket', description: 'Classic bomber jacket with satin finish. Ribbed collar, cuffs, and hem.', price: 120, compareAtPrice: 150, category: categories[3]._id, variants: genVariants(['Black', 'Olive'], ['M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'], colors: ['Black', 'Olive'], sizes: ['M', 'L', 'XL'], isFeatured: true, totalSold: 90, tags: ['bomber', 'satin', 'classic'] },
    { name: 'AKM Denim Trucker Jacket', slug: 'akm-denim-trucker-jacket', description: 'Washed denim trucker jacket with button closure. Timeless styling.', price: 110, category: categories[3]._id, variants: genVariants(['Indigo', 'Light Wash', 'Black'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600'], colors: ['Indigo', 'Light Wash', 'Black'], sizes: ['S', 'M', 'L', 'XL'], totalSold: 70, tags: ['denim', 'trucker'] },
    { name: 'AKM Windbreaker', slug: 'akm-windbreaker', description: 'Lightweight water-resistant windbreaker. Packable design with half-zip.', price: 95, category: categories[3]._id, variants: genVariants(['Black', 'Navy', 'Red'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'], colors: ['Black', 'Navy', 'Red'], sizes: ['S', 'M', 'L', 'XL'], totalSold: 55, tags: ['windbreaker', 'lightweight'] },
    // Accessories
    { name: 'AKM Logo Cap', slug: 'akm-logo-cap', description: 'Structured baseball cap with embroidered AKM logo. Adjustable buckle strap.', price: 28, category: categories[4]._id, variants: genVariants(['Black', 'White', 'Navy'], ['One Size']), images: ['https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600'], colors: ['Black', 'White', 'Navy'], sizes: ['One Size'], totalSold: 220, tags: ['cap', 'hat', 'logo'] },
    { name: 'AKM Beanie', slug: 'akm-beanie', description: 'Ribbed knit beanie with woven AKM label. Warm and stylish.', price: 22, category: categories[4]._id, variants: genVariants(['Black', 'Gray', 'Burgundy'], ['One Size']), images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600'], colors: ['Black', 'Gray', 'Burgundy'], sizes: ['One Size'], totalSold: 160, tags: ['beanie', 'winter', 'knit'] },
    { name: 'AKM Crossbody Bag', slug: 'akm-crossbody-bag', description: 'Compact crossbody bag with adjustable strap. Multiple compartments.', price: 45, category: categories[4]._id, variants: genVariants(['Black', 'Olive'], ['One Size']), images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'], colors: ['Black', 'Olive'], sizes: ['One Size'], totalSold: 85, tags: ['bag', 'crossbody'] },
    { name: 'AKM Premium Socks Pack', slug: 'akm-premium-socks-pack', description: '3-pack premium cotton socks with AKM branding. Comfort toe and arch support.', price: 18, category: categories[4]._id, variants: genVariants(['Black', 'White', 'Mixed'], ['S/M', 'L/XL']), images: ['https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600'], colors: ['Black', 'White', 'Mixed'], sizes: ['S/M', 'L/XL'], totalSold: 300, tags: ['socks', 'pack', 'cotton'] },
    { name: 'AKM Canvas Tote', slug: 'akm-canvas-tote', description: 'Heavy-duty canvas tote bag with screenprinted AKM design. Perfect for daily use.', price: 32, category: categories[4]._id, variants: genVariants(['Natural', 'Black'], ['One Size']), images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'], colors: ['Natural', 'Black'], sizes: ['One Size'], totalSold: 110, tags: ['tote', 'canvas', 'eco'] },
    { name: 'AKM Leather Belt', slug: 'akm-leather-belt', description: 'Genuine leather belt with custom AKM buckle. Premium quality craftsmanship.', price: 40, category: categories[4]._id, variants: genVariants(['Black', 'Brown'], ['S', 'M', 'L', 'XL']), images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'], colors: ['Black', 'Brown'], sizes: ['S', 'M', 'L', 'XL'], totalSold: 65, tags: ['belt', 'leather'] },
  ]);
  console.log(`👕 Created ${products.length} products`);

  // Create sample orders
  const sampleOrders = [];
  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  for (let i = 0; i < 15; i++) {
    const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
    const items = randomProducts.map((p: any) => ({
      product: p._id, name: p.name, image: p.images[0],
      color: p.colors[0], size: p.sizes[0], quantity: Math.floor(Math.random() * 3) + 1, price: p.price,
    }));
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    sampleOrders.push({
      orderNumber: `AKM-${(Date.now() + i).toString(36).toUpperCase()}`,
      user: customer._id,
      items,
      shippingAddress: { fullName: 'Ahmed Customer', phone: '+1234567891', street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001' },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      subtotal, discount: 0, shippingCost: subtotal > 500 ? 0 : 50, totalAmount: subtotal + (subtotal > 500 ? 0 : 50),
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // random date in last 90 days
    });
  }
  await Order.insertMany(sampleOrders);
  console.log(`📦 Created ${sampleOrders.length} sample orders`);

  // Create coupons
  await Coupon.insertMany([
    { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 50, maxUses: 100, expiresAt: new Date('2027-12-31'), description: '10% off for new customers' },
    { code: 'SAVE20', discountType: 'percentage', discountValue: 20, minPurchase: 100, maxDiscount: 50, maxUses: 50, expiresAt: new Date('2027-06-30'), description: '20% off, max $50 discount' },
    { code: 'FLAT15', discountType: 'fixed', discountValue: 15, minPurchase: 75, maxUses: 200, expiresAt: new Date('2027-12-31'), description: '$15 off on orders over $75' },
    { code: 'SUMMER25', discountType: 'percentage', discountValue: 25, minPurchase: 120, maxDiscount: 60, maxUses: 30, expiresAt: new Date('2026-09-01'), description: 'Summer sale 25% off' },
    { code: 'VIP50', discountType: 'fixed', discountValue: 50, minPurchase: 200, maxUses: 10, expiresAt: new Date('2027-12-31'), description: 'VIP $50 off on orders over $200' },
  ]);
  console.log('🎟️  Created coupons');

  // Create banners
  await Banner.insertMany([
    { title: 'New Collection 2026', subtitle: 'Discover the latest AKM streetwear collection', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', link: '/products', buttonText: 'Shop Now', sortOrder: 1 },
    { title: 'Summer Sale — Up to 40% Off', subtitle: 'Limited time offer on selected items', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', link: '/products?sort=popular', buttonText: 'View Deals', sortOrder: 2 },
    { title: 'Free Shipping Over $500', subtitle: 'On all domestic orders', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200', link: '/products', buttonText: 'Start Shopping', sortOrder: 3 },
  ]);
  console.log('🖼️  Created banners');

  console.log('\n✅ Seed completed successfully!');
  console.log('👤 Admin login: admin@akm.com / Admin123!');
  console.log('👤 Customer login: customer@akm.com / User123!');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});

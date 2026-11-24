import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Food Bridge AI database seeding...');

  // Clean existing data
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.foodMatch.deleteMany({});
  await prisma.delivery.deleteMany({});
  await prisma.donationRequest.deleteMany({});
  await prisma.foodDonation.deleteMany({});
  await prisma.volunteer.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});

  const demoPassword = await bcrypt.hash('Demo@1234', 10);

  // 1. Core Demo Accounts
  const adminUser = await prisma.user.create({
    data: {
      name: 'Priya Mehta (Admin)',
      email: 'admin@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'ADMIN',
      phone: '+91 98200 11223',
    },
  });

  const donorUser = await prisma.user.create({
    data: {
      name: 'Chef Rajesh Khanna',
      email: 'donor@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'DONOR',
      phone: '+91 98201 22334',
    },
  });

  const ngoUser = await prisma.user.create({
    data: {
      name: 'Sunita Rao',
      email: 'ngo@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'NGO',
      phone: '+91 98202 33445',
    },
  });

  const volunteerUser = await prisma.user.create({
    data: {
      name: 'Amit Sharma',
      email: 'volunteer@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'VOLUNTEER',
      phone: '+91 98203 44556',
    },
  });

  // Additional 4 Restaurant Donors
  const donor2 = await prisma.user.create({
    data: {
      name: 'Vikram Malhotra',
      email: 'grandheritage@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'DONOR',
      phone: '+91 98204 55667',
    },
  });

  const donor3 = await prisma.user.create({
    data: {
      name: 'Ananya Deshmukh',
      email: 'greenleaf@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'DONOR',
      phone: '+91 98205 66778',
    },
  });

  const donor4 = await prisma.user.create({
    data: {
      name: 'Suresh Patil',
      email: 'rasoi@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'DONOR',
      phone: '+91 98206 77889',
    },
  });

  const donor5 = await prisma.user.create({
    data: {
      name: 'Chef Jean Fernandes',
      email: 'goldencrust@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'DONOR',
      phone: '+91 98207 88990',
    },
  });

  // Additional 2 NGOs
  const ngo2 = await prisma.user.create({
    data: {
      name: 'Dr. Madhav Kulkarni',
      email: 'rotibank@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'NGO',
      phone: '+91 98208 99001',
    },
  });

  const ngo3 = await prisma.user.create({
    data: {
      name: 'Kavita Joshi',
      email: 'annapurna@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'NGO',
      phone: '+91 98209 10112',
    },
  });

  // 3 Food Banks
  const foodBank1 = await prisma.user.create({
    data: {
      name: 'Rohit Verma',
      email: 'feedingindia@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'NGO',
      phone: '+91 98210 21223',
    },
  });

  const foodBank2 = await prisma.user.create({
    data: {
      name: 'Manish Shinde',
      email: 'aahar@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'NGO',
      phone: '+91 98211 32334',
    },
  });

  const foodBank3 = await prisma.user.create({
    data: {
      name: 'Deepak More',
      email: 'sanjivani@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'NGO',
      phone: '+91 98212 43445',
    },
  });

  // Additional 4 Volunteers
  const vol2 = await prisma.user.create({
    data: {
      name: 'Pooja Patil',
      email: 'pooja.volunteer@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'VOLUNTEER',
      phone: '+91 98213 54556',
    },
  });

  const vol3 = await prisma.user.create({
    data: {
      name: 'Rahul Deshmukh',
      email: 'rahul.volunteer@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'VOLUNTEER',
      phone: '+91 98214 65667',
    },
  });

  const vol4 = await prisma.user.create({
    data: {
      name: 'Sneha Kulkarni',
      email: 'sneha.volunteer@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'VOLUNTEER',
      phone: '+91 98215 76778',
    },
  });

  const vol5 = await prisma.user.create({
    data: {
      name: 'Vikram Joshi',
      email: 'vikram.volunteer@foodbridge.demo',
      passwordHash: demoPassword,
      role: 'VOLUNTEER',
      phone: '+91 98216 87889',
    },
  });

  console.log('✅ Users created');

  // 2. Create Organizations (5 Restaurants, 3 NGOs, 3 Food Banks)
  // Restaurants (Donors)
  const orgDonor1 = await prisma.organization.create({
    data: {
      userId: donorUser.id,
      organizationName: 'Spice Route Bistro',
      organizationType: 'RESTAURANT',
      address: 'Hill Road, Bandra West, Mumbai, MH 400050',
      city: 'Mumbai',
      latitude: 19.0558,
      longitude: 72.8315,
      verificationStatus: 'VERIFIED',
      capacity: 150,
      contactPerson: 'Chef Rajesh Khanna',
      description: 'Modern Indian fine dining with surplus daily fresh culinary preparations.',
    },
  });

  const orgDonor2 = await prisma.organization.create({
    data: {
      userId: donor2.id,
      organizationName: 'Grand Heritage Hotel & Banquets',
      organizationType: 'HOTEL',
      address: 'Juhu Tara Road, Juhu, Mumbai, MH 400049',
      city: 'Mumbai',
      latitude: 19.0988,
      longitude: 72.8264,
      verificationStatus: 'VERIFIED',
      capacity: 350,
      contactPerson: 'Vikram Malhotra',
      description: 'Luxury hotel and banquet halls hosting events with surplus buffet portions.',
    },
  });

  const orgDonor3 = await prisma.organization.create({
    data: {
      userId: donor3.id,
      organizationName: 'Green Leaf Organic Cafe',
      organizationType: 'RESTAURANT',
      address: 'Lane 7, Koregaon Park, Pune, MH 411001',
      city: 'Pune',
      latitude: 18.5362,
      longitude: 73.8940,
      verificationStatus: 'VERIFIED',
      capacity: 80,
      contactPerson: 'Ananya Deshmukh',
      description: 'Farm-to-table organic eatery dedicated to zero avoidable food waste.',
    },
  });

  const orgDonor4 = await prisma.organization.create({
    data: {
      userId: donor4.id,
      organizationName: 'Maharashtra Rasoi & Catering',
      organizationType: 'RESTAURANT',
      address: 'Ranade Road, Dadar West, Mumbai, MH 400028',
      city: 'Mumbai',
      latitude: 19.0222,
      longitude: 72.8428,
      verificationStatus: 'VERIFIED',
      capacity: 200,
      contactPerson: 'Suresh Patil',
      description: 'Authentic Maharashtrian catering and dining with packaged meal trays.',
    },
  });

  const orgDonor5 = await prisma.organization.create({
    data: {
      userId: donor5.id,
      organizationName: 'The Golden Crust Artisan Bakery',
      organizationType: 'RESTAURANT',
      address: 'Lokhandwala Complex, Andheri West, Mumbai, MH 400053',
      city: 'Mumbai',
      latitude: 19.1418,
      longitude: 72.8277,
      verificationStatus: 'VERIFIED',
      capacity: 100,
      contactPerson: 'Jean Fernandes',
      description: 'Artisan bakery producing sourdough loaves, croissants, and gourmet pastries daily.',
    },
  });

  // NGOs
  const orgNgo1 = await prisma.organization.create({
    data: {
      userId: ngoUser.id,
      organizationName: 'Robin Hood Army - Mumbai Chapter',
      organizationType: 'NGO',
      address: 'Linking Road, Khar West, Mumbai, MH 400052',
      city: 'Mumbai',
      latitude: 19.0700,
      longitude: 72.8339,
      verificationStatus: 'VERIFIED',
      capacity: 300,
      contactPerson: 'Sunita Rao',
      description: 'Volunteer-driven food redistribution organization serving underprivileged communities.',
    },
  });

  const orgNgo2 = await prisma.organization.create({
    data: {
      userId: ngo2.id,
      organizationName: 'Roti Bank Foundation',
      organizationType: 'NGO',
      address: 'Station Road, Chembur, Mumbai, MH 400071',
      city: 'Mumbai',
      latitude: 19.0622,
      longitude: 72.8977,
      verificationStatus: 'VERIFIED',
      capacity: 400,
      contactPerson: 'Dr. Madhav Kulkarni',
      description: 'Operating dedicated food rescue vans across Mumbai and Thane.',
    },
  });

  const orgNgo3 = await prisma.organization.create({
    data: {
      userId: ngo3.id,
      organizationName: 'Annapurna Seva Trust',
      organizationType: 'NGO',
      address: 'Shivaji Nagar, Pune, MH 411005',
      city: 'Pune',
      latitude: 18.5314,
      longitude: 73.8446,
      verificationStatus: 'VERIFIED',
      capacity: 250,
      contactPerson: 'Kavita Joshi',
      description: 'Community kitchen providing wholesome meals to shelters and daily-wage workers.',
    },
  });

  // Food Banks
  const orgFoodBank1 = await prisma.organization.create({
    data: {
      userId: foodBank1.id,
      organizationName: 'Feeding India - Mumbai Hub',
      organizationType: 'FOOD_BANK',
      address: 'Dr. E Moses Road, Worli, Mumbai, MH 400018',
      city: 'Mumbai',
      latitude: 19.0178,
      longitude: 72.8174,
      verificationStatus: 'VERIFIED',
      capacity: 600,
      contactPerson: 'Rohit Verma',
      description: 'Equipped with cold storage, rapid response teams, and temperature-controlled vans.',
    },
  });

  const orgFoodBank2 = await prisma.organization.create({
    data: {
      userId: foodBank2.id,
      organizationName: 'Aahar Food Rescue Center',
      organizationType: 'FOOD_BANK',
      address: 'Gokhale Road, Thane West, MH 400602',
      city: 'Thane',
      latitude: 19.1860,
      longitude: 72.9759,
      verificationStatus: 'VERIFIED',
      capacity: 350,
      contactPerson: 'Manish Shinde',
      description: 'Regional food rescue facility with deep freeze and grain sorting capability.',
    },
  });

  const orgFoodBank3 = await prisma.organization.create({
    data: {
      userId: foodBank3.id,
      organizationName: 'Sanjivani Community Food Bank',
      organizationType: 'FOOD_BANK',
      address: 'Paud Road, Kothrud, Pune, MH 411038',
      city: 'Pune',
      latitude: 18.5074,
      longitude: 73.8077,
      verificationStatus: 'VERIFIED',
      capacity: 300,
      contactPerson: 'Deepak More',
      description: 'Local food pantry partnering with students and community volunteers.',
    },
  });

  console.log('✅ Organizations created');

  // 3. Create Volunteers
  const volRecord1 = await prisma.volunteer.create({
    data: {
      userId: volunteerUser.id,
      availability: true,
      transportType: 'MOTORCYCLE',
      vehicleNumber: 'MH-02-CD-5432',
      currentLatitude: 19.0550,
      currentLongitude: 72.8350,
      totalDeliveries: 12,
    },
  });

  const volRecord2 = await prisma.volunteer.create({
    data: {
      userId: vol2.id,
      availability: true,
      transportType: 'CAR',
      vehicleNumber: 'MH-02-EZ-9876',
      currentLatitude: 19.1350,
      currentLongitude: 72.8300,
      totalDeliveries: 18,
    },
  });

  const volRecord3 = await prisma.volunteer.create({
    data: {
      userId: vol3.id,
      availability: true,
      transportType: 'VAN',
      vehicleNumber: 'MH-12-AB-3344',
      currentLatitude: 18.5250,
      currentLongitude: 73.8500,
      totalDeliveries: 8,
    },
  });

  const volRecord4 = await prisma.volunteer.create({
    data: {
      userId: vol4.id,
      availability: true,
      transportType: 'CAR',
      vehicleNumber: 'MH-01-XY-1122',
      currentLatitude: 19.0200,
      currentLongitude: 72.8400,
      totalDeliveries: 24,
    },
  });

  const volRecord5 = await prisma.volunteer.create({
    data: {
      userId: vol5.id,
      availability: true,
      transportType: 'MOTORCYCLE',
      vehicleNumber: 'MH-04-QQ-7788',
      currentLatitude: 19.1800,
      currentLongitude: 72.9700,
      totalDeliveries: 15,
    },
  });

  console.log('✅ Volunteers created');

  // 4. Create 15 Realistic Food Donations with varied Urgency levels
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
  const hoursAhead = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000);

  const donationsData = [
    {
      donorId: donorUser.id,
      foodName: 'Dum Pukht Veg Biryani & Fresh Mirchi Ka Salan',
      category: 'COOKED_MEALS',
      description: 'Freshly prepared surplus biryani from dinner catering, packed in food-grade insulated aluminum containers. Untouched and handled with gloves.',
      quantity: 35,
      unit: 'meals',
      preparationTime: hoursAgo(2),
      expiryTime: hoursAhead(1.5), // CRITICAL: 1.5h remaining
      pickupAddress: 'Spice Route Bistro, Hill Road, Bandra West, Mumbai',
      latitude: 19.0558,
      longitude: 72.8315,
      storageConditions: 'WARM_HOT',
      allergenInformation: 'Contains Dairy (Ghee). Nut-free.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60',
      status: 'AVAILABLE',
      urgencyLevel: 'CRITICAL',
    },
    {
      donorId: donor2.id,
      foodName: 'Banquet Buffet Surplus: Paneer Butter Masala & Dal Makhani',
      category: 'COOKED_MEALS',
      description: 'High-quality banquet buffet overflow. Stored in hot holding units. Includes 100 butter rotis and 15 kg steamed jeera rice.',
      quantity: 80,
      unit: 'meals',
      preparationTime: hoursAgo(3),
      expiryTime: hoursAhead(3.5), // HIGH: 3.5h remaining
      pickupAddress: 'Grand Heritage Hotel, Juhu Tara Road, Mumbai',
      latitude: 19.0988,
      longitude: 72.8264,
      storageConditions: 'WARM_HOT',
      allergenInformation: 'Contains Dairy (Butter, Cream). Wheat (Gluten).',
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=60',
      status: 'REQUESTED',
      urgencyLevel: 'HIGH',
    },
    {
      donorId: donor5.id,
      foodName: 'Artisan Sourdough Loaves, Croissants & Baguettes',
      category: 'BAKERY',
      description: 'End-of-day fresh artisanal French baguettes, sourdough rounds, and chocolate croissants. Baked today morning.',
      quantity: 45,
      unit: 'packets',
      preparationTime: hoursAgo(8),
      expiryTime: hoursAhead(18), // NORMAL: 18h remaining
      pickupAddress: 'The Golden Crust Bakery, Lokhandwala, Andheri West, Mumbai',
      latitude: 19.1418,
      longitude: 72.8277,
      storageConditions: 'ROOM_TEMP',
      allergenInformation: 'Contains Gluten, Dairy.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60',
      status: 'AVAILABLE',
      urgencyLevel: 'NORMAL',
    },
    {
      donorId: donorUser.id,
      foodName: 'Organic Seasonal Apples & Nagpur Oranges Crate',
      category: 'FRUITS',
      description: 'Crates of ripe apples and sweet Nagpur oranges. Excellent condition, ideal for community shelter breakfast.',
      quantity: 50,
      unit: 'kg',
      preparationTime: hoursAgo(24),
      expiryTime: hoursAhead(36), // NORMAL
      pickupAddress: 'Spice Route Bistro, Bandra West, Mumbai',
      latitude: 19.0558,
      longitude: 72.8315,
      storageConditions: 'ROOM_TEMP',
      allergenInformation: 'None declared (Fresh fruit)',
      imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=60',
      status: 'APPROVED',
      urgencyLevel: 'NORMAL',
    },
    {
      donorId: donor4.id,
      foodName: 'Maharashtrian Pithla Bhakri & Thecha Meal Packs',
      category: 'COOKED_MEALS',
      description: 'Wholesome jowar bhakri with freshly prepared besan pithla and peanut thecha. Packed in eco-friendly meal boxes.',
      quantity: 60,
      unit: 'meals',
      preparationTime: hoursAgo(2),
      expiryTime: hoursAhead(4), // HIGH
      pickupAddress: 'Maharashtra Rasoi, Ranade Road, Dadar West, Mumbai',
      latitude: 19.0222,
      longitude: 72.8428,
      storageConditions: 'WARM_HOT',
      allergenInformation: 'Contains Peanuts (in thecha). Gluten-free.',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60',
      status: 'AVAILABLE',
      urgencyLevel: 'HIGH',
    },
    {
      donorId: donor3.id,
      foodName: 'Fresh Hydroponic Lettuce, Cherry Tomatoes & Cucumber Crates',
      category: 'VEGETABLES',
      description: 'Crisp green leaf lettuce, ruby cherry tomatoes, and english cucumbers harvested fresh from local greenhouse.',
      quantity: 30,
      unit: 'kg',
      preparationTime: hoursAgo(12),
      expiryTime: hoursAhead(28), // NORMAL
      pickupAddress: 'Green Leaf Organic Cafe, Koregaon Park, Pune',
      latitude: 18.5362,
      longitude: 73.8940,
      storageConditions: 'REFRIGERATED',
      allergenInformation: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60',
      status: 'AVAILABLE',
      urgencyLevel: 'NORMAL',
    },
    {
      donorId: donor2.id,
      foodName: 'Fresh Malai Paneer Blocks (Pasteurized Sealed Packs)',
      category: 'DAIRY',
      description: 'Chilled pasteurized cottage cheese (paneer) blocks from hotel banquet prep. Kept strictly at 3°C.',
      quantity: 25,
      unit: 'kg',
      preparationTime: hoursAgo(6),
      expiryTime: hoursAhead(8), // MEDIUM
      pickupAddress: 'Grand Heritage Hotel, Juhu, Mumbai',
      latitude: 19.0988,
      longitude: 72.8264,
      storageConditions: 'REFRIGERATED',
      allergenInformation: 'Contains Dairy.',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=60',
      status: 'ASSIGNED',
      urgencyLevel: 'MEDIUM',
    },
    {
      donorId: donorUser.id,
      foodName: 'South Indian Idli, Medu Vada & Sambar Breakfast Bar',
      category: 'COOKED_MEALS',
      description: 'Steamed fluffy idlis (120 pcs), crispy medu vadas, with 20 liters hot aromatic vegetable sambar.',
      quantity: 75,
      unit: 'meals',
      preparationTime: hoursAgo(1.5),
      expiryTime: hoursAhead(1.8), // CRITICAL: <2 hours
      pickupAddress: 'Spice Route Bistro, Bandra West, Mumbai',
      latitude: 19.0558,
      longitude: 72.8315,
      storageConditions: 'WARM_HOT',
      allergenInformation: 'Vada contains urad dal. Sambar contains mustard seeds.',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=60',
      status: 'AVAILABLE',
      urgencyLevel: 'CRITICAL',
    },
    {
      donorId: donor4.id,
      foodName: 'Packaged Whole Wheat Atta & Basmati Rice Rations',
      category: 'PACKAGED_FOOD',
      description: 'Unopened sealed 5kg flour bags and 10kg premium Basmati rice packets from surplus pantry storage.',
      quantity: 120,
      unit: 'kg',
      preparationTime: hoursAgo(48),
      expiryTime: hoursAhead(120), // NORMAL
      pickupAddress: 'Maharashtra Rasoi, Dadar West, Mumbai',
      latitude: 19.0222,
      longitude: 72.8428,
      storageConditions: 'ROOM_TEMP',
      allergenInformation: 'Contains Wheat (Gluten).',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=60',
      status: 'AVAILABLE',
      urgencyLevel: 'NORMAL',
    },
    {
      donorId: donor5.id,
      foodName: 'Assorted Danish Pastries & Banana Walnut Teacakes',
      category: 'BAKERY',
      description: 'Fresh baked pastries with fruit compote and rich walnut teacakes from afternoon production run.',
      quantity: 50,
      unit: 'packets',
      preparationTime: hoursAgo(5),
      expiryTime: hoursAhead(7), // MEDIUM
      pickupAddress: 'The Golden Crust Bakery, Andheri West, Mumbai',
      latitude: 19.1418,
      longitude: 72.8277,
      storageConditions: 'ROOM_TEMP',
      allergenInformation: 'Contains Tree Nuts (Walnuts), Gluten, Dairy.',
      imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&auto=format&fit=crop&q=60',
      status: 'REQUESTED',
      urgencyLevel: 'MEDIUM',
    },
    {
      donorId: donor3.id,
      foodName: 'Pulao with Mix Sprouts Usal & Chapati Tiffin Sets',
      category: 'COOKED_MEALS',
      description: 'Wholesome nutritious sprouted moong usal with vegetable pulao and freshly prepared phulkas.',
      quantity: 40,
      unit: 'meals',
      preparationTime: hoursAgo(2),
      expiryTime: hoursAhead(2.5), // HIGH
      pickupAddress: 'Green Leaf Cafe, Koregaon Park, Pune',
      latitude: 18.5362,
      longitude: 73.8940,
      storageConditions: 'WARM_HOT',
      allergenInformation: 'Contains Wheat (Gluten).',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60',
      status: 'PICKED_UP',
      urgencyLevel: 'HIGH',
    },
    {
      donorId: donor2.id,
      foodName: 'Mixed Fruit Salad Cups with Mint Infusion',
      category: 'FRUITS',
      description: 'Freshly diced pineapple, watermelon, kiwi, and pomegranate with natural mint dressing. Kept refrigerated.',
      quantity: 60,
      unit: 'packets',
      preparationTime: hoursAgo(4),
      expiryTime: hoursAhead(5), // HIGH
      pickupAddress: 'Grand Heritage Hotel, Juhu, Mumbai',
      latitude: 19.0988,
      longitude: 72.8264,
      storageConditions: 'REFRIGERATED',
      allergenInformation: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&auto=format&fit=crop&q=60',
      status: 'DELIVERED',
      urgencyLevel: 'HIGH',
    },
    {
      donorId: donorUser.id,
      foodName: 'Homestyle Moong Dal Khichdi & Papad Combos',
      category: 'COOKED_MEALS',
      description: 'Comforting, mild yellow lentil and rice khichdi prepared for corporate lunch. Stored in sanitized stainless tubs.',
      quantity: 50,
      unit: 'meals',
      preparationTime: hoursAgo(2.5),
      expiryTime: hoursAhead(3), // HIGH
      pickupAddress: 'Spice Route Bistro, Bandra West, Mumbai',
      latitude: 19.0558,
      longitude: 72.8315,
      storageConditions: 'WARM_HOT',
      allergenInformation: 'Contains Ghee.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
      status: 'DELIVERED',
      urgencyLevel: 'HIGH',
    },
    {
      donorId: donor4.id,
      foodName: 'Surplus Banquet Kheer (Sweet Rice Pudding)',
      category: 'DAIRY',
      description: 'Traditional slow-cooked cardamom milk and rice dessert from morning wedding ceremony. Packed in covered containers.',
      quantity: 30,
      unit: 'kg',
      preparationTime: hoursAgo(10),
      expiryTime: hoursAgo(1), // EXPIRED (demo test of automatic expiry detection)
      pickupAddress: 'Maharashtra Rasoi, Dadar West, Mumbai',
      latitude: 19.0222,
      longitude: 72.8428,
      storageConditions: 'REFRIGERATED',
      allergenInformation: 'Contains Milk, Almonds, Cashews.',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=60',
      status: 'EXPIRED',
      urgencyLevel: 'EXPIRED',
    },
    {
      donorId: donor5.id,
      foodName: 'Multigrain Sandwich Bread & Dinner Rolls (Bulk)',
      category: 'BAKERY',
      description: 'Oven-fresh soft dinner rolls and sliced multigrain sandwich loaves. Zero preservatives.',
      quantity: 80,
      unit: 'packets',
      preparationTime: hoursAgo(7),
      expiryTime: hoursAhead(16), // NORMAL
      pickupAddress: 'The Golden Crust Bakery, Andheri West, Mumbai',
      latitude: 19.1418,
      longitude: 72.8277,
      storageConditions: 'ROOM_TEMP',
      allergenInformation: 'Contains Gluten, Sesame seeds.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60',
      status: 'DELIVERED',
      urgencyLevel: 'NORMAL',
    },
  ];

  const createdDonations = [];
  for (const d of donationsData) {
    const donation = await prisma.foodDonation.create({
      data: d,
    });
    createdDonations.push(donation);
  }

  console.log(`✅ ${createdDonations.length} Food Donations created`);

  // 5. Create 10 Donation Requests
  const req1 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[0].id, // Veg Biryani (Bandra)
      organizationId: orgNgo1.id, // Robin Hood Army (Khar)
      requestedQuantity: 35,
      requestStatus: 'PENDING',
      notes: 'Can pick up immediately within 45 minutes for evening distribution at Santacruz shelter.',
    },
  });

  const req2 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[1].id, // Banquet Buffet (Juhu)
      organizationId: orgFoodBank1.id, // Feeding India (Worli)
      requestedQuantity: 80,
      requestStatus: 'APPROVED',
      notes: 'Dispatched refrigerated van for transport.',
    },
  });

  const req3 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[3].id, // Apples & Oranges (Bandra)
      organizationId: orgNgo1.id, // Robin Hood Army
      requestedQuantity: 50,
      requestStatus: 'APPROVED',
      notes: 'Will distribute among 120 children at community center tomorrow morning.',
    },
  });

  const req4 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[4].id, // Pithla Bhakri (Dadar)
      organizationId: orgNgo2.id, // Roti Bank
      requestedQuantity: 60,
      requestStatus: 'PENDING',
      notes: 'Ready for pickup from Dadar location.',
    },
  });

  const req5 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[6].id, // Malai Paneer (Juhu)
      organizationId: orgFoodBank2.id, // Aahar Food Bank
      requestedQuantity: 25,
      requestStatus: 'APPROVED',
      notes: 'Have cold storage capacity ready at Thane facility.',
    },
  });

  const req6 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[9].id, // Danish Pastries (Andheri)
      organizationId: orgNgo1.id,
      requestedQuantity: 50,
      requestStatus: 'PENDING',
      notes: 'Can collect at 6:30 PM today.',
    },
  });

  const req7 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[10].id, // Pune Usal Tiffin
      organizationId: orgNgo3.id, // Annapurna Seva Trust (Pune)
      requestedQuantity: 40,
      requestStatus: 'APPROVED',
      notes: 'Volunteer already dispatched via scooter.',
    },
  });

  const req8 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[11].id, // Mixed Fruit Salad (Juhu)
      organizationId: orgFoodBank1.id,
      requestedQuantity: 60,
      requestStatus: 'APPROVED',
      notes: 'Complete delivery mission successfully completed.',
    },
  });

  const req9 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[12].id, // Khichdi (Bandra)
      organizationId: orgNgo1.id,
      requestedQuantity: 50,
      requestStatus: 'APPROVED',
      notes: 'Delivered to night shelter.',
    },
  });

  const req10 = await prisma.donationRequest.create({
    data: {
      donationId: createdDonations[14].id, // Bread Rolls
      organizationId: orgNgo2.id,
      requestedQuantity: 80,
      requestStatus: 'APPROVED',
      notes: 'Delivered to community breakfast kitchen.',
    },
  });

  console.log('✅ 10 Donation Requests created');

  // 6. Create 5 Delivery Records (Module 7: Volunteer & Delivery Management)
  // Delivery 1: Assigned to demo volunteer Amit Sharma (Apples & Oranges)
  await prisma.delivery.create({
    data: {
      donationId: createdDonations[3].id,
      requestId: req3.id,
      volunteerId: volRecord1.id, // Amit Sharma
      deliveryStatus: 'ASSIGNED',
      notes: 'Assigned to motorcycle volunteer. Estimated pickup at 4:30 PM.',
    },
  });

  // Delivery 2: Assigned to volunteer Pooja Patil (Malai Paneer)
  await prisma.delivery.create({
    data: {
      donationId: createdDonations[6].id,
      requestId: req5.id,
      volunteerId: volRecord2.id, // Pooja Patil
      deliveryStatus: 'ASSIGNED',
      notes: 'Cold bag transport arranged in electric vehicle.',
    },
  });

  // Delivery 3: Picked Up by Rahul Deshmukh (Pune Sprouts Usal)
  await prisma.delivery.create({
    data: {
      donationId: createdDonations[10].id,
      requestId: req7.id,
      volunteerId: volRecord3.id, // Rahul Deshmukh
      deliveryStatus: 'PICKED_UP',
      pickupTime: hoursAgo(0.5),
      notes: 'Food verified, sealed, and currently in transit to Shivaji Nagar kitchen.',
    },
  });

  // Delivery 4: Delivered by Sneha Kulkarni (Fruit Salad Cups)
  await prisma.delivery.create({
    data: {
      donationId: createdDonations[11].id,
      requestId: req8.id,
      volunteerId: volRecord4.id, // Sneha Kulkarni
      deliveryStatus: 'DELIVERED',
      pickupTime: hoursAgo(4),
      deliveryTime: hoursAgo(3),
      proofImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60',
      notes: 'Delivered 60 fruit cups to Worli Hub supervisor Mr. Verma. Temperature verified fresh.',
    },
  });

  // Delivery 5: Delivered by Vikram Joshi (Bread Rolls)
  await prisma.delivery.create({
    data: {
      donationId: createdDonations[14].id,
      requestId: req10.id,
      volunteerId: volRecord5.id, // Vikram Joshi
      deliveryStatus: 'DELIVERED',
      pickupTime: hoursAgo(6),
      deliveryTime: hoursAgo(5),
      proofImage: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&auto=format&fit=crop&q=60',
      notes: 'Successfully delivered and signed by Roti Bank Chembur coordinator.',
    },
  });

  console.log('✅ 5 Delivery Records created');

  // 7. Seed Notifications for each demo user
  await prisma.notification.createMany({
    data: [
      {
        userId: donorUser.id,
        title: 'New Food Request! 📬',
        message: 'Robin Hood Army has requested 35 meals of Dum Pukht Veg Biryani.',
        type: 'REQUEST',
        isRead: false,
      },
      {
        userId: donorUser.id,
        title: 'Volunteer Dispatched 🛵',
        message: 'Amit Sharma is heading to pick up 50kg Organic Apples & Oranges.',
        type: 'STATUS',
        isRead: false,
      },
      {
        userId: ngoUser.id,
        title: 'Donation Approved! 🎉',
        message: 'Your request for 50kg Organic Apples from Spice Route Bistro was approved.',
        type: 'STATUS',
        isRead: false,
      },
      {
        userId: ngoUser.id,
        title: 'Urgent Nearby Surplus 🚨',
        message: 'Veg Biryani (35 meals) is expiring in under 2 hours in Bandra West!',
        type: 'URGENT',
        isRead: false,
      },
      {
        userId: volunteerUser.id,
        title: 'New Delivery Mission 🛵',
        message: 'Pickup 50kg Organic Apples from Spice Route Bistro (Bandra West) to Robin Hood Army (Khar).',
        type: 'INFO',
        isRead: false,
      },
    ],
  });

  console.log('✅ Notifications seeded');
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

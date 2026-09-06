import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'HP Pavilion 15 (Core i5, 16GB RAM, 512GB SSD)',
    price: 320000,
    originalPrice: 380000,
    description: 'Clean UK used HP Pavilion 15. Battery lasts 5+ hours on light load. Perfect for Computer Science, engineering coursework, and coding projects. Comes with original charger.',
    category: 'Gadgets',
    hostelLocation: 'Bronze Hostel',
    faculty: 'Information Technology & Applied Sciences',
    agreedLocation: 'LCU Senate Building Car Park',
    condition: 'Like New',
    status: 'Available',
    productStatus: 'Available',
    isFeatured: true,
    isBoosted: true,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Silver Crest 2.0L Cordless Electric Kettle',
    price: 14500,
    originalPrice: 18000,
    description: 'Fast boiling stainless steel electric kettle. Auto shut-off safety feature. Low power consumption, suitable for hostel rooms.',
    category: 'Hostel Items',
    hostelLocation: 'Silver Hostel',
    faculty: 'Basic Medical & Health Sciences',
    agreedLocation: 'Silver Hostel Security Gate',
    condition: 'New',
    status: 'Available',
    productStatus: 'Available',
    isFeatured: true,
    isBoosted: false,
    images: [
      'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'LCU Calculus & Analytical Geometry (Thomas 14th Ed.)',
    price: 7500,
    originalPrice: 12000,
    description: 'Essential textbook for 100L & 200L Engineering, Maths, and Computing. Clear print, no missing pages, neatly highlighted formulas.',
    category: 'Textbooks & Handouts',
    hostelLocation: 'Jasper Hall',
    faculty: 'Information Technology & Applied Sciences',
    agreedLocation: 'LCU Student Center / Cafeteria',
    condition: 'Good',
    status: 'Available',
    productStatus: 'Available',
    isFeatured: false,
    isBoosted: true,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Casio fx-991EX ClassWiz Scientific Calculator',
    price: 18000,
    originalPrice: 24000,
    description: 'Original Casio fx-991EX calculator with natural textbook display. Solar + battery dual power. Allowed in faculty examinations.',
    category: 'Gadgets',
    hostelLocation: 'Gold Hostel',
    faculty: 'Social & Management Sciences',
    agreedLocation: 'Gold Hostel Security Gate',
    condition: 'Like New',
    status: 'Available',
    productStatus: 'Available',
    isFeatured: true,
    isBoosted: false,
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Rechargeable LED Desk Study Lamp with Fan',
    price: 9500,
    originalPrice: 14000,
    description: '3 brightness levels with eye-protection warm light. Built-in mini fan and phone stand. Holds charge for up to 8 hours during outages.',
    category: 'Hostel Items',
    hostelLocation: 'Emerald Hall',
    faculty: 'Law',
    agreedLocation: 'Emerald Hall Common Area',
    condition: 'New',
    status: 'Available',
    productStatus: 'Available',
    isFeatured: false,
    isBoosted: false,
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Oxford Orthopaedic Mattress (3x6 Compact Hostel Size)',
    price: 28000,
    originalPrice: 40000,
    description: 'Clean, high-density orthopedic foam mattress. Standard LCU hostel bunk bed dimensions. Used for one semester only, spotless condition.',
    category: 'Hostel Items',
    hostelLocation: 'Platinum Hostel',
    faculty: 'Arts, Education & Humanities',
    agreedLocation: 'Platinum Hostel Lounge',
    condition: 'Good',
    status: 'Available',
    productStatus: 'Available',
    isFeatured: true,
    isBoosted: true,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Anti-Theft Waterproof Laptop Backpack (15.6 Inch)',
    price: 16000,
    originalPrice: 22000,
    description: 'Durable water-resistant backpack with external USB charging port and padded laptop sleeve. Lots of pockets for books and stationery.',
    category: 'Clothing & Fashion',
    hostelLocation: 'Pearl Hall',
    faculty: 'Social & Management Sciences',
    agreedLocation: 'Pearl Hall Main Entrance',
    condition: 'New',
    status: 'Available',
    productStatus: 'Available',
    isFeatured: false,
    isBoosted: false,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Sony WH-CH520 Wireless Bluetooth Headphones',
    price: 35000,
    originalPrice: 45000,
    description: 'Crisp sound with 50-hour battery life and quick charge. Built-in mic for calls and study meetings. Comes with original box.',
    category: 'Gadgets',
    hostelLocation: 'Sapphire Hall',
    faculty: 'Information Technology & Applied Sciences',
    agreedLocation: 'Sapphire Hall Gate',
    condition: 'Like New',
    status: 'Available',
    productStatus: 'Available',
    isFeatured: true,
    isBoosted: false,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: 'davince625@gmail.com' });
    if (!user) {
      user = await User.findOne();
    }
    if (!user) {
      console.error('No user found in database to assign as seller.');
      process.exit(1);
    }

    const currentCount = await Product.countDocuments();
    if (currentCount > 0) {
      console.log(`Database already has ${currentCount} products.`);
      process.exit(0);
    }

    console.log(`Seeding 8 products for seller: ${user.name} (${user.email})...`);
    for (const p of sampleProducts) {
      await Product.create({
        ...p,
        seller: user._id,
        image: p.images[0] || ''
      });
    }

    console.log('Successfully seeded 8 campus products with verified images!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding products:', err);
    process.exit(1);
  }
}

seed();

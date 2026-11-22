import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import User from './models/User.js';
import { products } from '../../shared/catalog.js';

export async function seedProducts({ force = false } = {}) {
  const count = await Product.estimatedDocumentCount();
  if (count > 0 && !force) {
    return { seeded: 0, skipped: true, existing: count };
  }

  const operations = products.map((item) => ({
    updateOne: {
      filter: { slug: item.slug },
      update: {
        $set: {
          slug: item.slug,
          name: item.name,
          category: item.category,
          categoryName: item.categoryName,
          price: item.price,
          oldPrice: item.oldPrice,
          rating: item.rating,
          reviews: item.reviews,
          stock: item.stock,
          badge: item.badge ?? null,
          featured: Boolean(item.featured),
          bestseller: Boolean(item.bestseller),
          images: item.images,
          description: item.description,
          specs: item.specs,
        },
      },
      upsert: true,
    },
  }));

  await Product.bulkWrite(operations);
  return { seeded: products.length, skipped: false };
}

export async function seedDemoUser() {
  const email = 'demo@shopvista.com';
  const existing = await User.findOne({ email });
  if (existing) return { created: false };

  await User.create({
    name: 'Demo Shopper',
    email,
    passwordHash: await bcrypt.hash('shopvista123', 10),
  });

  return { created: true };
}

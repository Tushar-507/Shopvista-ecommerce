import { Router } from 'express';
import Product from '../models/Product.js';
import { categories } from '../../../shared/catalog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sortMap = {
  featured: { featured: -1, reviews: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  popularity: { reviews: -1 },
  rating: { rating: -1, reviews: -1 },
  newest: { createdAt: -1 },
};

const isTruthy = (value) => value === '1' || value === 'true' || value === true;

router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((entry) => [entry._id, entry.count]));

    res.json({
      categories: categories.map((category) => ({
        ...category,
        count: countMap.get(category.slug) ?? 0,
      })),
    });
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      search = '',
      category = '',
      minPrice,
      maxPrice,
      sort = 'featured',
      featured,
      bestseller,
      sale,
      limit,
    } = req.query;

    const filter = {};

    if (category) filter.category = String(category);

    if (search && String(search).trim()) {
      const rx = new RegExp(escapeRegex(String(search).trim()), 'i');
      filter.$or = [{ name: rx }, { description: rx }, { categoryName: rx }];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      const min = Number(minPrice);
      const max = Number(maxPrice);
      if (Number.isFinite(min) && min > 0) filter.price.$gte = min;
      if (Number.isFinite(max) && max > 0) filter.price.$lte = max;
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    if (isTruthy(featured)) filter.featured = true;
    if (isTruthy(bestseller)) filter.bestseller = true;
    if (isTruthy(sale)) filter.$expr = { $gt: ['$oldPrice', '$price'] };

    const sortSpec = sortMap[String(sort)] ?? sortMap.featured;
    const requestedLimit = Number(limit);
    const cap = Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 0;

    let query = Product.find(filter).sort(sortSpec);
    if (cap) query = query.limit(cap);

    const [products, total] = await Promise.all([query.exec(), Product.countDocuments(filter)]);

    res.json({ products, total, source: 'mongodb' });
  }),
);

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: 'We could not find that product.' });
    }

    const related = await Product.find({
      category: product.category,
      slug: { $ne: product.slug },
    })
      .sort({ rating: -1, reviews: -1 })
      .limit(4);

    return res.json({ product, related });
  }),
);

export default router;

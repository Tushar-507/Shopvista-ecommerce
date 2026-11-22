import { Router } from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 9.99;

const round2 = (value) => Math.round(value * 100) / 100;

const makeOrderNumber = () =>
  `SV-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { items, customer, shippingAddress, paymentMethod } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your bag is empty.' });
    }

    if (!customer?.email || !emailPattern.test(String(customer.email).trim())) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }

    const address = shippingAddress ?? {};
    const requiredAddress = ['fullName', 'address', 'city', 'postalCode', 'country'];
    const missing = requiredAddress.filter(
      (field) => !address[field] || String(address[field]).trim().length === 0,
    );
    if (missing.length > 0) {
      return res.status(400).json({ message: 'Please complete your shipping address.' });
    }

    const slugs = [...new Set(items.map((item) => String(item.productId)))];
    const found = await Product.find({ slug: { $in: slugs } });
    const bySlug = new Map(found.map((product) => [product.slug, product]));

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const qty = Number(item.qty);
      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ message: 'Each item needs a valid quantity.' });
      }

      const product = bySlug.get(String(item.productId));
      if (!product) {
        return res.status(400).json({
          message: `One of the products in your bag is no longer available.`,
        });
      }

      if (product.stock > 0 && qty > product.stock) {
        return res.status(409).json({
          message: `Only ${product.stock} of ${product.name} left in stock.`,
        });
      }

      subtotal += product.price * qty;
      orderItems.push({
        productId: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
      });
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = round2(subtotal + shipping);

    const order = await Order.create({
      orderNumber: makeOrderNumber(),
      user: req.user._id,
      customer: {
        email: String(customer.email).trim().toLowerCase(),
        phone: customer.phone ? String(customer.phone).trim() : '',
      },
      shippingAddress: {
        fullName: String(address.fullName).trim(),
        address: String(address.address).trim(),
        city: String(address.city).trim(),
        postalCode: String(address.postalCode).trim(),
        country: String(address.country).trim(),
      },
      items: orderItems,
      subtotal: round2(subtotal),
      shipping,
      total,
      paymentMethod: paymentMethod === 'Cash on delivery' ? 'Cash on delivery' : 'Card',
    });

    res.status(201).json({ order });
  }),
);

router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ orders });
  }),
);

export default router;

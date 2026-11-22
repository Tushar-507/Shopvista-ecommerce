import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body ?? {};

    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ message: 'Please enter your full name.' });
    }
    if (!email || !emailPattern.test(String(email).trim())) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (!password || String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const normalized = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalized });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalized,
      passwordHash,
    });

    return res.status(201).json({ token: signToken(user), user });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({
      email: String(email).trim().toLowerCase(),
    }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    return res.json({ token: signToken(user), user });
  }),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  }),
);

export default router;

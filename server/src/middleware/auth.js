import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const secret = () => process.env.JWT_SECRET || 'shopvista-dev-secret-change-me';

export const signToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, secret(), { expiresIn: '7d' });

const readUser = async (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  if (!token) return null;

  try {
    const payload = jwt.verify(token, secret());
    return await User.findById(payload.sub);
  } catch {
    return null;
  }
};

export const requireAuth = asyncHandler(async (req, res, next) => {
  const user = await readUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Please sign in to continue.' });
  }
  req.user = user;
  return next();
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  req.user = await readUser(req);
  next();
});

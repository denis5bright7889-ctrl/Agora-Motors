// server/controllers/authController.js — Auth logic

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate a signed JWT for a user ID
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Build the auth response payload
 */
const authResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Update last login (fire-and-forget)
  User.findByIdAndUpdate(user._id, { lastLogin: new Date() }).exec();

  res.status(statusCode).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
};

// ─── Register ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already in use' });
  }

  const user = await User.create({ name, email, password, phone });
  authResponse(user, 201, res);
};

// ─── Login ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Include password in query (normally excluded)
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  authResponse(user, 200, res);
};

// ─── Get current user ──────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('listingCount');
  res.json({ success: true, user: user.toSafeObject() });
};

// ─── Update profile ────────────────────────────────────────────────────────

/**
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  );

  res.json({ success: true, user: user.toSafeObject() });
};

// ─── Change password ───────────────────────────────────────────────────────

/**
 * PUT /api/auth/password
 */
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  const token = signToken(user._id);
  res.json({ success: true, message: 'Password updated', token });
};

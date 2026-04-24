// server/middleware/validate.js — express-validator request validation

const { body, validationResult } = require('express-validator');

/**
 * Run after validation chains — sends 400 if errors exist
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Auth validators ──────────────────────────────────────────────────────────

const validateRegister = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// ─── Car validators ───────────────────────────────────────────────────────────

const validateCar = [
  body('title').trim().isLength({ min: 5, max: 120 }).withMessage('Title must be 5–120 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Valid year required'),
  body('mileage').isFloat({ min: 0 }).withMessage('Mileage must be a non-negative number'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validateCar };

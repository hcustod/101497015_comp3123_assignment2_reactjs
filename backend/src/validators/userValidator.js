import { body } from 'express-validator';

export const signupValidator = [
  body('username').isString().trim().isLength({ min: 3, max: 30 })
    .withMessage('username 3–30 chars'),
  body('email').isEmail().normalizeEmail()
    .withMessage('valid email required'),
  body('password').isString().isLength({ min: 8 })
    .withMessage('password min 8 chars'),
];

export const loginValidator = [
  body('password').isString().notEmpty().withMessage('password required'),
  // must provide either email or username
  body().custom(({ email, username }) => {
    if (!email && !username) throw new Error('Provide email or username');
    return true;
  }),
  body('email').optional().isEmail().withMessage('invalid email'),
  body('username').optional().isString().isLength({ min: 3 }),
];

import { body } from 'express-validator';

export const createEmployeeValidator = [
  body('first_name').isString().notEmpty(),
  body('last_name').isString().notEmpty(),
  body('email').isEmail(),
  body('position').isString().notEmpty(),
  body('salary').isNumeric().custom(v => v >= 0),
  body('date_of_joining').isISO8601(),
  body('department').isString().notEmpty(),
];

export const updateEmployeeValidator = [
  body('first_name').optional().isString().notEmpty(),
  body('last_name').optional().isString().notEmpty(),
  body('email').optional().isEmail(),
  body('position').optional().isString().notEmpty(),
  body('salary').optional().isNumeric().custom(v => v >= 0),
  body('date_of_joining').optional().isISO8601(),
  body('department').optional().isString().notEmpty(),
];

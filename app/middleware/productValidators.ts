// product.validator.ts

import { body } from 'express-validator';

export const productValidators = [
    body('productName').notEmpty().withMessage('Product name is required.'),
    body('categoryID').isNumeric().withMessage('Category ID must be a number.'),
    // Add other validators as needed
];

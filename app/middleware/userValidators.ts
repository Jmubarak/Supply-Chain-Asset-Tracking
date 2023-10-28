import { body, check, ValidationChain } from 'express-validator';

// Assuming you still want to use the dotenv here
import dotenv from 'dotenv';
dotenv.config();

// Validators for New User
const validateNewUser: ValidationChain[] = [
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 255 })
        .withMessage('Password should be between 8 and 255 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
        .withMessage('Password must have at least: 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character (!@#$%^&*), and be at least 8 characters long.'),
    body('role')
        .custom((value: string) => {
            if (value !== 'user' && value !== 'admin') {
                throw new Error('Role must be either "user" or "admin"');
            } else {
                return true;
            }
        }),
];

// Validators for Login
const validateLogin: ValidationChain[] = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
];

// Validators for Changing Password
const validateChangePassword: ValidationChain[] = [
    check('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    check('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8, max: 255 })
        .withMessage('New password should be between 8 and 255 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
        .withMessage('Password must have at least: 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character (!@#$%^&*), and be at least 8 characters long.')
];

// Validators for Changing Email
const validateChangeEmail: ValidationChain[] = [
    body('newEmail')
        .isEmail()
        .withMessage('Valid new email is required'),
    body('password')
        .notEmpty()
        .withMessage('Current password is required for email change')
];

export {
    validateNewUser,
    validateLogin,
    validateChangePassword,
    validateChangeEmail
};

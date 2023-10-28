import express, { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import validateToken from '../../middleware/validateToken';

// Import the combined module
import {
    validateNewUser,
    validateLogin,
    validateChangePassword,
    validateChangeEmail
} from '../../middleware/userValidators';  // Update this path to point to your combined module

import * as userControllers from './controller';

const router: Router = express.Router();
config();

// Sign up route
router.post('/signup', validateNewUser, userControllers.signUp);


// Login route
router.post('/login', validateLogin, userControllers.login);

// Logout route
router.post('/logout', validateToken, userControllers.logout);

// Get current user profile route
router.get('/profile', validateToken, userControllers.getCurrentUserProfile);

// Update user profile route
router.put('/profile', validateToken, userControllers.updateUserProfile);

// Change password route
router.put('/profile/password', validateToken, validateChangePassword, userControllers.changePassword);

// Change email route
router.put('/profile/email', validateToken, validateChangeEmail, userControllers.changeEmail);

// Delete profile
router.delete('/profile', validateToken, userControllers.deleteUserProfile);

export default router;

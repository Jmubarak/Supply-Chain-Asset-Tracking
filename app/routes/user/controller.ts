import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserService from '../../services/userService';
import { expiresInToMilliseconds } from '../../utils/tokenHelper';
import {UserRequest} from '../../interfaces/userRequest'

// Use dotenv with TypeScript
import dotenv from 'dotenv';
dotenv.config();

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Extracting error messages from the errors.array()
        const errorMessages = errors.array().map(err => err.msg);

        // Pass the error messages to the error-handling middleware
        next({ status: 400, message: errorMessages.join(', '), errors: errors.array() });
        return; // Ensures the rest of the handler won't run
    }

    try {
        await UserService.createUser(req.body);
        res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
        next(error);
    }
};








// Handle user login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Pass the error to the error-handling middleware
        next({ status: 400, message: 'Validation Errors', errors: errors.array() });
        return; // Ensures the rest of the handler won't run
    }

    const email = req.body.email;
    const password = req.body.password;

    // Validate email and password
    if (!email || !password) {
        next({ status: 400, message: 'Both email and password are required.' });
        return; // Ensures the rest of the handler won't run
    }

    try {
        const { user, token } = await UserService.loginUser(email, password);
        
        const maxAge = expiresInToMilliseconds(process.env.TOKEN_EXPIRATION!);  
        
        res.cookie('auth_token', token, {
            httpOnly: false,
            maxAge: maxAge,
            // Other cookie options like 'secure: true' if using HTTPS
        });
        
        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error("Error during login:", error);
        
        if (error.message === 'Invalid credentials') {
            next({ status: 401, message: error.message });
            return; // Ensures the rest of the handler won't run
        }
        
        next(new Error('Failed to login. Please try again later.'));
    }
};








// Handle user logout
export const logout = (req: Request, res: Response, next: NextFunction): void => {
    // Invalidate the JWT token by setting its expiration to a past time
    res.cookie('auth_token', '', {
        expires: new Date(0),
        httpOnly: true
    });

    res.status(200).json({ message: 'Logged out successfully' });
};










//get current user profile
export const getCurrentUserProfile = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.userId; // User ID from decoded JWT

    // Input Validation
    if (isNaN(userId)) {  // Use isNaN() to check if the conversion was successful.
        next({ status: 400, message: 'User ID is required and must be a valid number.' });
        return; // Ensures the rest of the handler won't run
    }

    try {
        const user = await UserService.fetchUserById(userId);

        // Exclude the password and id from the response
        if (user) {
            const { password, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword);
        } else {
            next({ status: 404, message: 'User not found.' });
            return; // Ensures the rest of the handler won't run
        }

    } catch (error) {
        // Log the error for debugging and monitoring
        console.error("Error fetching user profile:", error);
        next(new Error('Failed to retrieve user profile. Please try again later.'));
    }
};






export const updateUserProfile = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ status: 400, message: 'Validation Errors', errors: errors.array() });
        return; // Ensures the rest of the handler won't run
    }

    
    const userId = req.user.userId; // User ID from decoded JWT
    const updatedUserData = req.body; // User data to be updated

    try {
        const updatedUser = await UserService.updateUser(userId, updatedUserData);

        if (!updatedUser) {
            next({ status: 404, message: 'User not found' });
            return; // Ensures the rest of the handler won't run
        }

        // Invalidate the JWT token by setting its expiration to a past time
        res.cookie('auth_token', '', {
            expires: new Date(0),
            httpOnly: true
        });

        res.status(200).json({ message: 'User profile updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error); // Log the error for debugging purposes


            next({ status: 500, message: 'Internal server error' });
        
    }
};



export const deleteUserProfile = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.userId; // User ID from decoded JWT

    try {
        // Use UserService's deleteUser method
        const result = await UserService.deleteUser(userId);

        if (!result) {
            res.status(404).json({ error: 'User not found' });
            return; // Ensures the rest of the handler won't run
        }
        
        res.status(200).json({message: 'User profile deleted successfully.'});
    } catch (error) {
        console.error('Error deleting user:', error); // For debugging purposes
        next({ status: 500, message: 'Internal server error' });
    }
};













export const changePassword = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ status: 400, message: 'Validation Errors', errors: errors.array() });
        return;
    }

    const userId = req.user.userId; // User ID from decoded JWT
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        next({ status: 400, message: 'Both current and new passwords are required.' });
        return;
    }

    try {
        const result = await UserService.changePassword(userId, currentPassword, newPassword);

        if (result) {
            res.status(200).json({ message: 'Password changed successfully.' });
        } else {
            next({ status: 500, message: 'Error changing password.' });
        }
    } catch (error) {
        console.error('Error changing password:', error);

        if (error.message === 'Incorrect current password') {
            next({ status: 401, message: error.message });
            return;
        }

        next(new Error('Failed to change password. Please try again later.'));
    }
};











export const changeEmail = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ status: 400, message: 'Validation Errors', errors: errors.array() });
        return;
    }

    const userId = req.user.userId; // User ID from decoded JWT
    const { newEmail, password } = req.body;

    try {
        const result = await UserService.changeEmail(userId, newEmail, password);

        if (result) {
            res.status(200).json({ message: 'Email changed successfully.' });
        } else {
            next({ status: 500, message: 'Error changing email.' });
        }
    } catch (error) {
        console.error('Error changing email:', error);

        if (error.message === 'Incorrect password.') {
            next({ status: 401, message: error.message });
            return;
        }

        if (error.message === 'The new email is already in use.') {
            next({ status: 400, message: error.message });
            return;
        }

        next(new Error('Failed to change email. Please try again later.'));
    }
};

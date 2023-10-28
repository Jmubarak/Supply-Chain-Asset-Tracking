import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import {UserRequest} from '../interfaces/userRequest';

dotenv.config();


const validateToken = (req: UserRequest, res: Response, next: NextFunction): void => {
    // Get the token from the cookie
    const token = req.cookies.auth_token;

    if (!token) {
        return next(new Error('Access denied. No token provided.'));
    }

    try {
        // Verify the token with our secret key
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET as string);
        
        // Add the decoded payload to request object if further information from token is needed
        req.user = decodedPayload;

        next();  // Proceed to the next middleware or route handler
    } catch (ex) {
        next(new Error('Invalid token.'));
    }
};

export default validateToken;

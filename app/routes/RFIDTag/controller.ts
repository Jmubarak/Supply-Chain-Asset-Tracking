import { Request, Response, NextFunction } from 'express';
import RFIDTagService from '../../services/RFIDTagService';
import { validationResult } from 'express-validator';
import { UserRequest } from '../../interfaces/userRequest';

export class RFIDTagController {

    static async createTag(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Extracting error messages from the errors.array()
        const errorMessages = errors.array().map(err => err.msg);

        // Pass the error messages to the error-handling middleware
        next({ status: 400, message: errorMessages.join(', '), errors: errors.array() });
        return; // Ensures the rest of the handler won't run
        }

        const tagData = req.body;

        try {
            const tag = await RFIDTagService.createTag(tagData);
            res.status(201).json(tag);
        } catch (error) {
            next(error);
        }
    }

    static async getTagsCreatedByUser(req: UserRequest, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Extracting error messages from the errors.array()
        const errorMessages = errors.array().map(err => err.msg);

        // Pass the error messages to the error-handling middleware
        next({ status: 400, message: errorMessages.join(', '), errors: errors.array() });
        return; // Ensures the rest of the handler won't run
        }

        try {
            const userId = req.user.userId;
            const tags = await RFIDTagService.getTagsCreatedByUserWithOrderInfo(userId);
            res.status(200).json(tags);
        } catch (error) {
            next(error);
        }
    }
    static async getTagById(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           // Extracting error messages from the errors.array()
        const errorMessages = errors.array().map(err => err.msg);

        // Pass the error messages to the error-handling middleware
        next({ status: 400, message: errorMessages.join(', '), errors: errors.array() });
        return; // Ensures the rest of the handler won't run
        }

        const tagId = parseInt(req.params.tagId, 10);
        try {
            const tag = await RFIDTagService.getTagById(tagId);
            if (!tag) {
                res.status(404).json({ message: 'Tag not found.' });
                return;
            }
            res.status(200).json(tag);
        } catch (error) {
            next(error);
        }
    }

    static async updateTag(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Extracting error messages from the errors.array()
        const errorMessages = errors.array().map(err => err.msg);

        // Pass the error messages to the error-handling middleware
        next({ status: 400, message: errorMessages.join(', '), errors: errors.array() });
        return; // Ensures the rest of the handler won't run
        }

        const tagId = parseInt(req.params.tagId, 10);
        const updatedData = req.body;

        try {
            const updatedTag = await RFIDTagService.updateTag(tagId, updatedData);
            if (!updatedTag) {
                res.status(404).json({ message: 'Tag not found or update failed.' });
                return;
            }
            res.status(200).json(updatedTag);
        } catch (error) {
            next(error);
        }
    }

    static async deleteTag(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Extracting error messages from the errors.array()
        const errorMessages = errors.array().map(err => err.msg);

        // Pass the error messages to the error-handling middleware
        next({ status: 400, message: errorMessages.join(', '), errors: errors.array() });
        return; // Ensures the rest of the handler won't run
        }

        const tagId = parseInt(req.params.tagId, 10);
        try {
            const success = await RFIDTagService.deleteTag(tagId);
            if (!success) {
                res.status(404).json({ message: 'Tag not found or deletion failed.' });
                return;
            }
            res.status(204).end(); // No content response for successful deletion
        } catch (error) {
            next(error);
        }
    }
}

import { body, param } from 'express-validator';

export const RFIDTagValidators = {

    createTag: [
        body('associatedOrderID')
            .isInt()
            .withMessage('Associated order ID should be an integer.'),
        body('createdByUserID')
            .isInt()
            .withMessage('Created by user ID should be an integer.'),
    ],

    getTagsCreatedByUser: [
        param('userId')
            .isInt()
            .withMessage('User ID should be an integer.'),
    ],


    getTagById: [
        param('tagId')
            .isInt()
            .withMessage('Tag ID should be an integer.'),
    ],

    updateTag: [
        param('tagId')
            .isInt()
            .withMessage('Tag ID should be an integer.'),
        // Add specific fields you want to validate for updates, similar to body validators
    ],

    deleteTag: [
        param('tagId')
            .isInt()
            .withMessage('Tag ID should be an integer.'),
    ],
};

import { body, param } from 'express-validator';

export const RFIDTagValidators = {

    createTag : [
        body('associatedOrder.orderID')
            .isInt()
            .withMessage('Associated order ID should be an integer.'),
        body('createdByUser.userID')
            .isInt()
            .withMessage('Created by user ID should be an integer.'),
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
        
    ],

    deleteTag: [
        param('tagId')
            .isInt()
            .withMessage('Tag ID should be an integer.'),
    ],
};

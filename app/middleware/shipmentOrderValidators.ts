import { body, param } from 'express-validator';

export const ShipmentOrderValidators = {

    createShipmentOrder: [
        body('senderName')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('Sender name is required.'),
        
        body('recipientName')
            .optional()
            .isString()
            .trim()
            .notEmpty()
            .withMessage('Recipient name should be a string if provided.'),
        
        body('product.productID')
            .isInt()
            .withMessage('Product ID should be an integer.'),
        
    ],

    getShipmentOrderById: [
        param('orderId')
            .isInt()
            .withMessage('Order ID should be an integer.'),
    ],

    updateShipmentOrder: [
        param('orderId')
            .isInt()
            .withMessage('Order ID should be an integer.'),

     
        
    ],

    deleteShipmentOrder: [
        param('orderId')
            .isInt()
            .withMessage('Order ID should be an integer.'),
    ],
};


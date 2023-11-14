import { body } from 'express-validator';

export const rfidScannerValidators = [
    
    body('nodeID')
        .isNumeric()
        .withMessage('Node ID must be a number and is required.'),

   
];

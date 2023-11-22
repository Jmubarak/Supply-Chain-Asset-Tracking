import { body } from 'express-validator';

export const rfidScanRecordValidators = [
    
    body('scannerID')
        .isNumeric()
        .withMessage('Scanner ID must be a number and is required.'),

    body('tagID')
        .isNumeric()
        .withMessage('Tag ID must be a number and is required.'),
];

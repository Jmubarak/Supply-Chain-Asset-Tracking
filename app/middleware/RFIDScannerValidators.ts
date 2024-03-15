import { body } from 'express-validator';

export const rfidScannerValidators = [
    
    body('nodeID')
        .isNumeric()
        .withMessage('Node ID must be a number and is required.'),

    // Validator for the 'location' field
    body('location')
        .trim() // Remove leading and trailing whitespace
        .isLength({ min: 1 }) // Ensure the string is not empty
        .withMessage('Location is required and cannot be empty.')
        // Additional validation can be added here, such as checking string pattern
        // .matches(/some-regex/).withMessage('Location format is invalid.')
];

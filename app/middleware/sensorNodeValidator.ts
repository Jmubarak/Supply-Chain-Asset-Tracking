import { body } from 'express-validator';

export const sensorNodeValidators = [
    body('nodeID')
        .isNumeric()
        .withMessage('Node ID must be a number and is required.')
];

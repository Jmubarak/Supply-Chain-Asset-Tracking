import express from 'express';
import { RFIDTagController } from './controller'; // Update with actual path
import { RFIDTagValidators } from '../../middleware/RFIDTagValidators'; // Update with actual path
import validateToken from '../../middleware/validateToken'; // Update with actual path

const router = express.Router();

router.use(validateToken);

// Create an RFID tag
router.post(
    '/create',
    RFIDTagValidators.createTag,
    RFIDTagController.createTag
);

// Get all RFID tags created by a user
router.get(
    '/user',
    RFIDTagValidators.getTagsCreatedByUser,
    RFIDTagController.getTagsCreatedByUser
);

// Get a specific RFID tag by ID
router.get(
    '/:tagId',
    RFIDTagValidators.getTagById,
    RFIDTagController.getTagById
);

// Update a specific RFID tag by ID
router.patch(
    '/:tagId',
    RFIDTagValidators.updateTag,
    RFIDTagController.updateTag
);

// Delete a specific RFID tag by ID
router.delete(
    '/:tagId',
    RFIDTagValidators.deleteTag,
    RFIDTagController.deleteTag
);

export default router;

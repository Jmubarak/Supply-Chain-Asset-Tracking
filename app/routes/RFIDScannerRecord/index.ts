import { Router } from 'express';
import RFIDScanRecordController from './controller'; // Adjust the import path as necessary
import { rfidScanRecordValidators } from '../../middleware/RFIDScannerRecordValidators'; // Adjust the import path as necessary

const router = Router();

// Fetch all RFIDScanRecords
router.get('/', RFIDScanRecordController.getAllScanRecords);

// Fetch an RFIDScanRecord by its ID
router.get('/:id', RFIDScanRecordController.getScanRecordById);

// Create a new RFIDScanRecord
router.post('/', rfidScanRecordValidators, RFIDScanRecordController.createScanRecord);

// Update an RFIDScanRecord by its ID
router.put('/:id', rfidScanRecordValidators, RFIDScanRecordController.updateScanRecord);

// Delete an RFIDScanRecord by its ID
router.delete('/:id', RFIDScanRecordController.deleteScanRecord);

export default router;

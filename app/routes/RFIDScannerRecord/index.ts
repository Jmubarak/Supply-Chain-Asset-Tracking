import { Router } from 'express';
import RFIDScanRecordController from './controller'; // Adjust the import path as necessary
import { rfidScanRecordValidators } from '../../middleware/RFIDScannerRecordValidators'; // Adjust the import path as necessary

const router = Router();


//get the latest sensor node where at tag was scanned in (if any)
router.get('/tag/:tagID', RFIDScanRecordController.getCurrentNodeOfTag);

// Fetch an RFIDScanRecord by its ID
router.get('/:id', RFIDScanRecordController.getScanRecordById);

// Fetch all RFIDScanRecords
router.get('/', RFIDScanRecordController.getAllScanRecords);

// Create a new RFIDScanRecord
router.post('/', rfidScanRecordValidators, RFIDScanRecordController.createScanRecord);

// Update an RFIDScanRecord by its ID
router.put('/:id', rfidScanRecordValidators, RFIDScanRecordController.updateScanRecord);

// Delete an RFIDScanRecord by its ID
router.delete('/:id', RFIDScanRecordController.deleteScanRecord);

export default router;

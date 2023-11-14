import { Router } from 'express';
import RFIDScannerController from './controller';
import { rfidScannerValidators } from '../../middleware/RFIDScannerValidators';


const router = Router();

// If needed, you can add middleware here for authentication or any other global checks for the RFIDScanner routes.

// Fetch all RFIDScanners
router.get('/', RFIDScannerController.getAllScanners);

// Fetch an RFIDScanner by its ID
router.get('/:id', RFIDScannerController.getScannerById);

// Create a new RFIDScanner
router.post('/', rfidScannerValidators, RFIDScannerController.createScanner);

// Update an RFIDScanner by its ID
router.put('/:id', rfidScannerValidators, RFIDScannerController.updateScanner);

// Delete an RFIDScanner by its ID
router.delete('/:id', RFIDScannerController.deleteScanner);

export default router;

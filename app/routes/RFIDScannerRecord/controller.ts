import { Request, Response, NextFunction } from 'express';
import RFIDScanRecordService from '../../services/RFIDScannerRecordService';
import { RFIDTag } from '../../src/entity/RFIDTag';

class RFIDScanRecordController {

    async createScanRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const scanRecord = await RFIDScanRecordService.createScanRecord(req.body);
            res.status(201).json(scanRecord);
        } catch (error) {
            next(error);
        }
    }

    async getAllScanRecords(req: Request, res: Response, next: NextFunction) {
        try {
            const scanRecords = await RFIDScanRecordService.getAllScanRecords();
            res.json(scanRecords);
        } catch (error) {
            next(error);
        }
    }

    async getScanRecordById(req: Request, res: Response, next: NextFunction) {
        try {
            const scanRecord = await RFIDScanRecordService.getScanRecordById(Number(req.params.id));
            if (!scanRecord) {
                return res.status(404).json({ message: 'Scan record not found.' });
            }
            res.json(scanRecord);
        } catch (error) {
            next(error);
        }
    }



    async getCurrentNodeOfTag(req: Request, res: Response, next: NextFunction) {
        try {
            const tagIDStr = req.params.tagID;
    
            if (!tagIDStr) {
                return res.status(400).json({ message: 'Tag ID is required.' });
            }
    
            // Convert tagID to a number if necessary
            const tagID = Number(tagIDStr);
            if (isNaN(tagID)) {
                return res.status(400).json({ message: 'Invalid Tag ID.' });
            }
    
            // Construct a partial RFIDTag object
            const partialTag: Partial<RFIDTag> = { tagID };
    
            const nodeID = await RFIDScanRecordService.getCurrentNodeOfTag(partialTag);
    
            if (nodeID === null) {
                res.status(404).json({ message: 'Tag not found or not currently in a node.' });
            } else {
                res.json({ nodeID: nodeID });
            }
        } catch (error) {
            next(error);
        }
    }
    
    


    async updateScanRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const scanRecord = await RFIDScanRecordService.updateScanRecord(Number(req.params.id), req.body);
            if (!scanRecord) {
                return res.status(404).json({ message: 'Scan record not found.' });
            }
            res.json(scanRecord);
        } catch (error) {
            next(error);
        }
    }

    async deleteScanRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const deleted = await RFIDScanRecordService.deleteScanRecord(Number(req.params.id));
            if (deleted) {
                res.json({ message: 'Scan record deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Scan record not found.' });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new RFIDScanRecordController();

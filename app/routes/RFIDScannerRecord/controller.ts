import { Request, Response, NextFunction } from 'express';
import RFIDScanRecordService from '../../services/RFIDScannerRecordService';

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

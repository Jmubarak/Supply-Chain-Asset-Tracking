import { Request, Response, NextFunction } from 'express';
import RFIDScannerService from '../../services/RFIDScannerService';

class RFIDScannerController {
  
    async createScanner(req: Request, res: Response, next: NextFunction) {
        try {
            const scanner = await RFIDScannerService.createScanner(req.body);
            res.status(201).json(scanner);
        } catch (error) {
            next(error);
        }
    }

    async getAllScanners(req: Request, res: Response, next: NextFunction) {
        try {
            const scanners = await RFIDScannerService.getAllScanners();
            res.json(scanners);
        } catch (error) {
            next(error);
        }
    }

    async getScannerById(req: Request, res: Response, next: NextFunction) {
        try {
            const scanner = await RFIDScannerService.getScannerById(Number(req.params.id));
            if (!scanner) {
                return res.status(404).json({ message: 'Scanner not found.' });
            }
            res.json(scanner);
        } catch (error) {
            next(error);
        }
    }

    async updateScanner(req: Request, res: Response, next: NextFunction) {
        try {
            const scanner = await RFIDScannerService.updateScanner(Number(req.params.id), req.body);
            if (!scanner) {
                return res.status(404).json({ message: 'Scanner not found.' });
            }
            res.json(scanner);
        } catch (error) {
            next(error);
        }
    }

    async deleteScanner(req: Request, res: Response, next: NextFunction) {
        try {
            const deleted = await RFIDScannerService.deleteScanner(Number(req.params.id));
            if (deleted) {
                res.json({ message: 'Scanner deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Scanner not found.' });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new RFIDScannerController();

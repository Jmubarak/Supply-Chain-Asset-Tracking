import { Request, Response, NextFunction } from 'express';
import SensorNodeService from '../../services/sensorNodeService'; 

class SensorNodeController {

    async createSensorNode(req: Request, res: Response, next: NextFunction) {
        try {
            const sensorNode = await SensorNodeService.createSensorNode(req.body);
            res.status(201).json(sensorNode);
        } catch (error) {
            next(error);
        }
    }

    async getAllSensorNodes(req: Request, res: Response, next: NextFunction) {
        try {
            const sensorNodes = await SensorNodeService.getAllSensorNodes();
            res.json(sensorNodes);
        } catch (error) {
            next(error);
        }
    }

    async getSensorNodeById(req: Request, res: Response, next: NextFunction) {
        try {
            const sensorNode = await SensorNodeService.getSensorNodeById(Number(req.params.id));
            if (!sensorNode) {
                return res.status(404).json({ message: 'Sensor Node not found.' });
            }
            res.json(sensorNode);
        } catch (error) {
            next(error);
        }
    }

    async updateSensorNode(req: Request, res: Response, next: NextFunction) {
        try {
            const sensorNode = await SensorNodeService.updateSensorNode(Number(req.params.id), req.body);
            if (!sensorNode) {
                return res.status(404).json({ message: 'Sensor Node not found.' });
            }
            res.json(sensorNode);
        } catch (error) {
            next(error);
        }
    }

    async deleteSensorNode(req: Request, res: Response, next: NextFunction) {
        try {
            const deleted = await SensorNodeService.deleteSensorNode(Number(req.params.id));
            if (deleted) {
                res.json({ message: 'Sensor Node deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Sensor Node not found.' });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new SensorNodeController();

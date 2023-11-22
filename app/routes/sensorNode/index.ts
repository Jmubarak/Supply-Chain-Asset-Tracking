import { Router } from 'express';
import SensorNodeController from './controller'; // Adjust the import path as necessary
import { sensorNodeValidators } from '../../middleware/sensorNodeValidator'; // Adjust the import path as necessary

const router = Router();

// Fetch all SensorNodes
router.get('/', SensorNodeController.getAllSensorNodes);

// Fetch a SensorNode by its ID
router.get('/:id', SensorNodeController.getSensorNodeById);

// Create a new SensorNode
router.post('/', sensorNodeValidators, SensorNodeController.createSensorNode);

// Update a SensorNode by its ID
router.put('/:id', sensorNodeValidators, SensorNodeController.updateSensorNode);

// Delete a SensorNode by its ID
router.delete('/:id', SensorNodeController.deleteSensorNode);

export default router;

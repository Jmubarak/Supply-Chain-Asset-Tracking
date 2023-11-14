import express from 'express';
import {ShipmentOrderController} from './controller'
import {ShipmentOrderValidators} from '../../middleware/shipmentOrderValidators'; 
import validateToken from '../../middleware/validateToken';


const router = express.Router();


router.use(validateToken);

// Create a shipment order
router.post(
    '/create',
    ShipmentOrderValidators.createShipmentOrder,
    ShipmentOrderController.createShipmentOrder
);

// Get all shipment orders for a user
router.get(
    '/user',
    ShipmentOrderController.getAllShipmentOrdersByUser
);

// Get a specific shipment order by ID
router.get(
    '/:orderId',
    ShipmentOrderValidators.getShipmentOrderById,
    ShipmentOrderController.getShipmentOrderById
);

// Update a specific shipment order by ID
router.patch(
    '/:orderId',
    ShipmentOrderValidators.updateShipmentOrder,
    ShipmentOrderController.updateShipmentOrder
);

// Delete a specific shipment order by ID
router.delete(
    '/:orderId',
    ShipmentOrderValidators.deleteShipmentOrder,
    ShipmentOrderController.deleteShipmentOrder
);

export default router;

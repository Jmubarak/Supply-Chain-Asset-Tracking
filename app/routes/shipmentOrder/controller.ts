import { Request, Response, NextFunction } from 'express';
import ShipmentOrderService from '../../services/shipmentOrderService';
import { validationResult } from 'express-validator';
import {UserRequest} from '../../interfaces/userRequest'


///return validation errors correctly
export class ShipmentOrderController {
    static async createShipmentOrder(req: UserRequest, res: Response, next: NextFunction) {
        console.log("[DEBUG] createShipmentOrder - Entry");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Extracting error messages from the errors.array()
            const errorMessages = errors.array().map(err => err.msg);
    
            // Pass the error messages to the error-handling middleware
            next({ status: 400, message: errorMessages.join(', '), errors: errors.array() });
            return; // Ensures the rest of the handler won't run
        }

        const {recipientName, ...orderData } = req.body;
        const senderID = req.user.userId

        try {
            console.log("[DEBUG] createShipmentOrder - Processing order for:", senderID, recipientName);
            const order = await ShipmentOrderService.createOrderAndRelatedEntity(senderID, recipientName, orderData);
            res.status(201).json(order);
        } catch (error) {
            console.error("[DEBUG] createShipmentOrder - Error:", error);
            next(error);
        }
    }

    static async getAllShipmentOrdersByUser(req: UserRequest, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errors.array());
        }

        try {
            const userId = req.user.userId;
            const orders = await ShipmentOrderService.getAllShipmentOrdersByUser(userId);
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    static async getShipmentOrderById(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errors.array());
        }

        try {
            const orderId = parseInt(req.params.orderId, 10);
            const order = await ShipmentOrderService.getShipmentOrderById(orderId);
            if (!order) {
                res.status(404).json({ message: 'Order not found.' });
                return;
            }
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }

    static async updateShipmentOrder(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errors.array());
        }

        const orderId = parseInt(req.params.orderId, 10);
        const updatedData = req.body;

        try {ShipmentOrderController.createShipmentOrder
            const updatedOrder = await ShipmentOrderService.updateShipmentOrder(orderId, updatedData);
            res.status(200).json(updatedOrder);
        } catch (error) {
            next(error);
        }
    }

    static async deleteShipmentOrder(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errors.array());
        }

        try {
            const orderId = parseInt(req.params.orderId, 10);
            await ShipmentOrderService.deleteShipmentOrder(orderId);
            res.status(204).end(); // No content response for successful deletion
        } catch (error) {
            next(error);
        }
    }
}


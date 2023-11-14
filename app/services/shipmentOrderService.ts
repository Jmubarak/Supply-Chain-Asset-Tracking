import { ShipmentOrder } from '../src/entity/ShipmentOrder';
import { User } from '../src/entity/User';
import { NonUser } from '../src/entity/NonUser';
import { Product } from '../src/entity/Product';
import { AppDataSource } from '../src/data-source';

class ShipmentOrderService {
  
    static async createShipmentOrder(senderName: string, recipientName: string | null, orderData: Partial<ShipmentOrder>): Promise<ShipmentOrder> {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const nonUserRepository = AppDataSource.getRepository(NonUser);  // Get the NonUser repository
            const orderRepository = AppDataSource.getRepository(ShipmentOrder);
            const productRepository = AppDataSource.getRepository(Product);
            
            // Check for sender existence in the database
            const sender = await userRepository.findOne({ where: { name: senderName } });
            if (!sender) {
                throw new Error('Sender not found in the system.');
            }
    
            // Ensure that the product in the shipment belongs to the sender
            const product = await productRepository.findOne({ where: { productID: orderData.product.productID }, relations: ["user"] });
            if (!product) {
                throw new Error('Product not found in the system.');
            }
    
            if (product.user.userID !== sender.userID) {
                throw new Error('The product does not belong to the sender.');
            }
    
            let recipientUser: User | null = null;
            let recipientNonUser: NonUser | null = null;
            if (recipientName) {
                recipientUser = await userRepository.findOne({ where: { name: recipientName } });
                if (!recipientUser) {
                    console.warn('Recipient not found in the system, checking for existing NonUser entity.');
                    recipientNonUser = await nonUserRepository.findOne({ where: { name: recipientName, createdByUser: sender } });
                    if (!recipientNonUser) {
                        console.warn('Creating a new NonUser entity.');
                        recipientNonUser = nonUserRepository.create({ name: recipientName, createdByUser: sender });
                        await nonUserRepository.save(recipientNonUser);
                    }
                }
            }
    
            // Associate the shipment with the sender and possibly a recipient using their IDs
            orderData.sender = sender;
    
            if (recipientUser) {
                orderData.recipientUser = recipientUser;
            } else if (recipientNonUser) {
                orderData.recipientNonUser = recipientNonUser;
            }
    
            const order = orderRepository.create(orderData);
            return await orderRepository.save(order);
        } catch (error) {
            console.error("Database error during shipment order creation:", error);
            throw error; // Re-throw the error to allow for proper error handling upstream
        }
    }
    
  

    static async getAllShipmentOrdersByUser(userId: number): Promise<any[]> {
        try {
            const orderRepository = AppDataSource.getRepository(ShipmentOrder);
            const results = await orderRepository
                .createQueryBuilder("shipmentOrder")
                .leftJoinAndSelect("shipmentOrder.sender", "sender", "sender.userID = :userId", { userId })
                .leftJoinAndSelect("shipmentOrder.recipientUser", "recipientUser", "recipientUser.userID = :userId", { userId })
                .leftJoinAndSelect("shipmentOrder.recipientNonUser", "recipientNonUser")
                .leftJoinAndSelect("shipmentOrder.product", "product")
                .where("sender.userID = :userId OR recipientUser.userID = :userId", { userId })
                .getMany();

            // Map the results to the structured format
            return results.map(this.mapShipmentOrderToStructuredObject);
        } catch (error) {
            console.error("Database error during shipment orders fetch:", error);
            throw new Error('Failed to fetch shipment orders. Please try again later.');
        }
    }

    private static mapShipmentOrderToStructuredObject(shipmentOrder: ShipmentOrder): any {
        return {
            order: {
                orderID: shipmentOrder.orderID,
                quantity: shipmentOrder.quantity,
                shipmentDate: shipmentOrder.shipmentDate,
                status: shipmentOrder.status
            },
            product: {
                productID: shipmentOrder.product.productID,
                productName: shipmentOrder.product.productName,
                // ...other product fields
            },
            sender: {
                name: shipmentOrder.sender.name,
                // ...other sender fields
            },
            recipientUser: shipmentOrder.recipientUser ? {
                name: shipmentOrder.recipientUser.name,
                // ...other recipient fields, depending on whether recipient is a User or NonUser
            } : null,
            recipientNonUser: shipmentOrder.recipientNonUser ? {
                name: shipmentOrder.recipientNonUser.name,
                // ...other recipient fields, depending on whether recipient is a User or NonUser
            } : null
        };
    }

    
  
  
  static async getShipmentOrderById(orderId: number): Promise<ShipmentOrder | null> {
    try {
        const orderRepository = AppDataSource.getRepository(ShipmentOrder);
        const order = await orderRepository.findOne({
            where: { orderID: orderId },
            relations: ["sender", "recipient", "product"]
        });
        
        if (!order) {
            throw new Error('Order not found.');
        }
        
        return order;
    } catch (error) {
        console.error("Database error during shipment order fetch:", error);
        throw new Error('Failed to fetch shipment order. Please try again later.');
    }
}


static async updateShipmentOrder(orderId: number, updatedData: Partial<ShipmentOrder>): Promise<ShipmentOrder> {
  try {
      const orderRepository = AppDataSource.getRepository(ShipmentOrder);

      // Check if updatedData has any unwanted properties
      const allowedUpdates = ['status'];
      const updates = Object.keys(updatedData);
      const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

      if (!isValidUpdate) {
          throw new Error('Invalid update parameters. Only the product can be updated.');
      }

      await orderRepository.update(orderId, updatedData);
      return this.getShipmentOrderById(orderId);
  } catch (error) {
      console.error("Database error during shipment order update:", error);
      throw new Error('Failed to update shipment order. Please try again later.');
  }
}


static async deleteShipmentOrder(orderId: number): Promise<void> {
    try {
        const orderRepository = AppDataSource.getRepository(ShipmentOrder);
        await orderRepository.delete(orderId);
    } catch (error) {
        console.error("Database error during shipment order deletion:", error);
        throw new Error('Failed to delete shipment order. Please try again later.');
    }
}

}

export default ShipmentOrderService;

import { ShipmentOrder } from '../src/entity/ShipmentOrder';
import { User } from '../src/entity/User';
import { NonUser } from '../src/entity/NonUser';
import { Product } from '../src/entity/Product';
import { AppDataSource } from '../src/data-source';
import RFIDTagService from './RFIDTagService';
import { EntityManager } from 'typeorm';
import { RFIDTag } from '../src/entity/RFIDTag';

class ShipmentOrderService {
  
    static async createShipmentOrder(transactionManager: EntityManager,senderId: number, recipientName: string | null, orderData: Partial<ShipmentOrder>): Promise<{ shipmentDate: string, orderID: number, status: string }> {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const nonUserRepository = AppDataSource.getRepository(NonUser);  
            const orderRepository = transactionManager.getRepository(ShipmentOrder);
            const productRepository = AppDataSource.getRepository(Product);
        
            
            // Check for sender existence in the database using userID
            const sender = await userRepository.findOne({ where: { userID: senderId } });
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
    
            // Associate the shipment with the sender (using userID) and possibly a recipient
            orderData.sender = sender;
    
            if (recipientUser) {
                orderData.recipientUser = recipientUser;
            } else if (recipientNonUser) {
                orderData.recipientNonUser = recipientNonUser;
            }
    
            const order = orderRepository.create(orderData);
            const savedOrder = await orderRepository.save(order);
            console.log(savedOrder.orderID)
    
            return this.mapShipmentOrderToStructuredObject(savedOrder);
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
                .leftJoinAndSelect("shipmentOrder.sender", "sender")
                .leftJoinAndSelect("shipmentOrder.recipientUser", "recipientUser")
                .leftJoinAndSelect("shipmentOrder.recipientNonUser", "recipientNonUser")
                .leftJoinAndSelect("shipmentOrder.product", "product")
                // Join RFIDTag table and select tagID
                .leftJoinAndSelect("shipmentOrder.rfidTags", "rfidTag")
                .where("sender.userID = :userId OR recipientUser.userID = :userId", { userId })
                .getMany();
            console.log(results);
            return results.map(this.mapShipmentOrderToStructuredObject);
        } catch (error) {
            console.error("Database error during shipment orders fetch:", error);
            throw new Error('Failed to fetch shipment orders. Please try again later.');
        }
    }
    
    

    private static mapShipmentOrderToStructuredObject(shipmentOrder: ShipmentOrder): any {
        return {
            
                orderID: shipmentOrder.orderID,
                quantity: shipmentOrder.quantity,
                shipmentDate: shipmentOrder.shipmentDate,
                status: shipmentOrder.status
            ,
            product: {
                productID: shipmentOrder.product.productID,
                productName: shipmentOrder.product.productName,
                // ...other product fields
            },
            sender: shipmentOrder.sender? {
                name: shipmentOrder.sender.name,
                // ...other sender fields
            }: null,
            recipientUser: shipmentOrder.recipientUser ? {
                name: shipmentOrder.recipientUser.name,
                // ...other recipient fields, depending on whether recipient is a User or NonUser
            } : null,
            recipientNonUser: shipmentOrder.recipientNonUser ? {
                name: shipmentOrder.recipientNonUser.name,
                // ...other recipient fields, depending on whether recipient is a User or NonUser
            } : null,
            tagsID: shipmentOrder.rfidTags
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



static async createOrderAndRelatedEntity(senderId: number, recipientName: string | null, orderData: Partial<ShipmentOrder>){
     // Assuming you have a function to get your TypeORM data source
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        
        

        const order = await this.createShipmentOrder(queryRunner.manager, senderId, recipientName, orderData);
        console.log(order.orderID)
        const tag = await RFIDTagService.createTagForOrder(queryRunner.manager, order.orderID, senderId);

        await queryRunner.commitTransaction();
        return { order, tag };
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Transaction failed:", error);
        throw error; // Or handle it as per your strategy
    } finally {
        await queryRunner.release();
    }
}


}

export default ShipmentOrderService;

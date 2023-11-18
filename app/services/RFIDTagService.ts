import { RFIDTag } from '../src/entity/RFIDTag';
import {User} from '../src/entity/User';
import { ShipmentOrder } from '../src/entity/ShipmentOrder';
import { AppDataSource } from '../src/data-source';

class RFIDTagService {
  
  static async createTag(tagData: Partial<RFIDTag>): Promise<RFIDTag> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const orderRepository = AppDataSource.getRepository(ShipmentOrder);
      const tagRepository = AppDataSource.getRepository(RFIDTag);
  
      // Ensuring createdByUser and associatedOrder are provided
      if (!tagData.createdByUser || !tagData.createdByUser.userID) {
        throw new Error('Created by user ID must be provided.');
      }
      if (!tagData.associatedOrder || !tagData.associatedOrder.orderID) {
        throw new Error('Associated order ID must be provided.');
      }
  
      // Check if the associated user exists
      const userExists = await userRepository.findOneBy({ userID: tagData.createdByUser.userID });
      if (!userExists) {
        throw new Error('Associated user does not exist.');
      }
  
      // Check if the associated order exists
      const orderExists = await orderRepository.findOneBy({ orderID: tagData.associatedOrder.orderID });
      if (!orderExists) {
        throw new Error('Associated order does not exist.');
      }
  
      const tag = tagRepository.create(tagData);
      return await tagRepository.save(tag);
    } catch (error) {
      console.error("Database error during tag creation:", error);
      throw new Error('Failed to create tag. Please try again later.');
    }
  }
  
  
    

  static async getAllTags(): Promise<RFIDTag[]> {
    try {
      return await AppDataSource.getRepository(RFIDTag).find();
    } catch (error) {
      console.error("Database error during tags fetch:", error);
      throw new Error('Failed to fetch tags. Please try again later.');
    }
  }

static async getTagsCreatedByUserWithOrderInfo(userId: number): Promise<any[]> {
    try {
      console.log('Starting to fetch tags created by user with ID:', userId);

      const tagRepository = AppDataSource.getRepository(RFIDTag);
      console.log('RFIDTag repository accessed successfully');

      const tags = await tagRepository
          .createQueryBuilder("rfidTag")
          .leftJoinAndSelect("rfidTag.createdByUser", "user")
          .leftJoinAndSelect("rfidTag.associatedOrder", "shipmentOrder")
          .where("user.userID = :userId", { userId })
          .getMany();

      console.log(`Found ${tags.length} tags created by user with ID: ${userId}`);

      const structuredTags = tags.map(this.mapTagToStructuredObject);
      console.log(`Structured tags created successfully for user with ID: ${userId}`);

      return structuredTags;
    } catch (error) {
      console.error("Database error during fetching tags and associated orders created by user:", error);
      throw new Error('Failed to fetch tags and their associated orders created by the user. Please try again later.');
    }
}

  
  static async getTagById(tagId: number): Promise<RFIDTag | null> {
    try {
      const tag = await AppDataSource.getRepository(RFIDTag).findOne({ where: { tagID: tagId } });
      return tag || null;
    } catch (error) {
      console.error("Database error during tag fetch:", error);
      throw new Error('Failed to fetch tag. Please try again later.');
    }
  }

  static async updateTag(tagId: number, updatedTagData: Partial<RFIDTag>): Promise<RFIDTag | null> {
    try {
      const tagRepository = AppDataSource.getRepository(RFIDTag);
      const result = await tagRepository.update(tagId, updatedTagData)
        if (result.affected !== 1) {
            return null;
          }
          return await tagRepository.findOne({ where: { tagID: tagId } });
        } catch (error) {
          console.error("Database error during tag update:", error);
          throw new Error('Failed to update tag. Please try again later.');
        }
      }
    
      static async deleteTag(tagId: number): Promise<boolean> {
        try {
          const result = await AppDataSource.getRepository(RFIDTag).delete(tagId);
          return !!result.affected;
        } catch (error) {
          console.error("Database error during tag deletion:", error);
          throw new Error('Failed to delete tag. Please try again later.');
        }
      }

      private static mapTagToStructuredObject(rfidTag: RFIDTag): any {
        return {
          tag: {
            tagID: rfidTag.tagID,
           
          },
          createdByUser: {
            userID: rfidTag.createdByUser.userID,
            userName: rfidTag.createdByUser.name,
            
          },
          associatedOrder: rfidTag.associatedOrder ? {
            orderID: rfidTag.associatedOrder.orderID,
            status: rfidTag.associatedOrder.status
            
            
          } : null
        };
      }

    }
    
    export default RFIDTagService;
    
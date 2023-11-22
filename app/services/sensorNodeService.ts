import { SensorNode } from '../src/entity/SensorNode'; // Adjust the import path as necessary
import { AppDataSource } from  '../src/data-source';
class SensorNodeService {

  static async createSensorNode(sensorNodeData: Partial<SensorNode>): Promise<SensorNode> {
    try {
      const sensorNodeRepository = AppDataSource.getRepository(SensorNode);
      const sensorNode = sensorNodeRepository.create(sensorNodeData);
      return await sensorNodeRepository.save(sensorNode);
    } catch (error) {
      console.error("Database error during sensor node creation:", error);
      throw new Error('Failed to create sensor node. Please try again later.');
    }
  }

  static async getAllSensorNodes(): Promise<SensorNode[]> {
    try {
      return await AppDataSource.getRepository(SensorNode).find();
    } catch (error) {
      console.error("Database error during sensor nodes fetch:", error);
      throw new Error('Failed to fetch sensor nodes. Please try again later.');
    }
  }

  static async getSensorNodeById(nodeId: number): Promise<SensorNode | null> {
    try {
      const sensorNode = await AppDataSource.getRepository(SensorNode).findOne({ where: { nodeID: nodeId } });
      return sensorNode || null;
    } catch (error) {
      console.error("Database error during sensor node fetch:", error);
      throw new Error('Failed to fetch sensor node. Please try again later.');
    }
  }

  static async updateSensorNode(nodeId: number, updatedSensorNodeData: Partial<SensorNode>): Promise<SensorNode | null> {
    try {
      const sensorNodeRepository = AppDataSource.getRepository(SensorNode);
      const result = await sensorNodeRepository.update(nodeId, updatedSensorNodeData);
      if (result.affected !== 1) {
        return null;
      }
      return await sensorNodeRepository.findOne({ where: { nodeID: nodeId } });
    } catch (error) {
      console.error("Database error during sensor node update:", error);
      throw new Error('Failed to update sensor node. Please try again later.');
    }
  }

  static async deleteSensorNode(nodeId: number): Promise<boolean> {
    try {
      const result = await AppDataSource.getRepository(SensorNode).delete(nodeId);
      return !!result.affected;
    } catch (error) {
      console.error("Database error during sensor node deletion:", error);
      throw new Error('Failed to delete sensor node. Please try again later.');
    }
  }
}

export default SensorNodeService;

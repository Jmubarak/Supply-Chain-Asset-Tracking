import { RFIDScanner } from '../src/entity/RFIDScanner';
import { AppDataSource } from '../src/data-source';

class RFIDScannerService {
  
  static async createScanner(scannerData: Partial<RFIDScanner>): Promise<RFIDScanner> {
    try {
        console.log("Received scanner data:", scannerData); // Log the received data

        const scannerRepository = AppDataSource.getRepository(RFIDScanner);
        const scanner = scannerRepository.create(scannerData);

        const savedScanner = await scannerRepository.save(scanner);

        return savedScanner;
    } catch (error) {
        console.error("Database error during scanner creation:", error);
        throw new Error('Failed to create scanner. Please try again later.');
    }
}


  static async getAllScanners(): Promise<RFIDScanner[]> {
    try {
      return await AppDataSource.getRepository(RFIDScanner).find();
    } catch (error) {
      console.error("Database error during scanners fetch:", error);
      throw new Error('Failed to fetch scanners. Please try again later.');
    }
  }

  static async getScannerById(scannerId: number): Promise<RFIDScanner | null> {
    try {
        const scannerRepository = AppDataSource.getRepository(RFIDScanner);
        const scanner = await scannerRepository
            .createQueryBuilder("rfidScanner")
            .leftJoinAndSelect("rfidScanner.node", "sensorNode")
            .addSelect("sensorNode.nodeID")
            .where("rfidScanner.scannerID = :scannerId", { scannerId })
            .getOne();

        return scanner || null;
    } catch (error) {
        console.error("Database error during scanner fetch:", error);
        throw new Error('Failed to fetch scanner. Please try again later.');
    }
}


  static async updateScanner(scannerId: number, updatedScannerData: Partial<RFIDScanner>): Promise<RFIDScanner | null> {
    try {
      const scannerRepository = AppDataSource.getRepository(RFIDScanner);
      const result = await scannerRepository.update(scannerId, updatedScannerData);
      if (result.affected !== 1) {
        return null;
      }
      return await scannerRepository.findOne({ where: { scannerID: scannerId } });
    } catch (error) {
      console.error("Database error during scanner update:", error);
      throw new Error('Failed to update scanner. Please try again later.');
    }
  }

  static async deleteScanner(scannerId: number): Promise<boolean> {
    try {
      const result = await AppDataSource.getRepository(RFIDScanner).delete(scannerId);
      return !!result.affected;
    } catch (error) {
      console.error("Database error during scanner deletion:", error);
      throw new Error('Failed to delete scanner. Please try again later.');
    }
  }
}

export default RFIDScannerService;

import { RFIDScanRecord } from '../src/entity/RFIDScanRecord';
import { AppDataSource } from '../src/data-source';
import { RFIDTag } from '../src/entity/RFIDTag'; 

class RFIDScanRecordService {
  
  static async createScanRecord(recordData: Partial<RFIDScanRecord>): Promise<RFIDScanRecord> {
    try {
      const recordRepository = AppDataSource.getRepository(RFIDScanRecord);
      const record = recordRepository.create(recordData);
      return await recordRepository.save(record);
    } catch (error) {
      console.error("Database error during scan record creation:", error);
      throw new Error('Failed to create scan record. Please try again later.');
    }
  }

  static async getAllScanRecords(): Promise<RFIDScanRecord[]> {
    try {
      return await AppDataSource.getRepository(RFIDScanRecord).find();
    } catch (error) {
      console.error("Database error during scan records fetch:", error);
      throw new Error('Failed to fetch scan records. Please try again later.');
    }
  }

  static async getScanRecordById(recordId: number): Promise<RFIDScanRecord | null> {
    try {
      const record = await AppDataSource.getRepository(RFIDScanRecord).findOne({ where: { recordID: recordId } });
      return record || null;
    } catch (error) {
      console.error("Database error during scan record fetch:", error);
      throw new Error('Failed to fetch scan record. Please try again later.');
    }
  }

  static async getCurrentNodeOfTag(rfidTag: Partial<RFIDTag>): Promise<number | null> {
    try {
        console.log('getCurrentNodeOfTag - Start: ', rfidTag);

        // Ensure that the RFIDTag object has a tagID
        if (!rfidTag.tagID) {
            console.error('Error: RFIDTag entity must have a tagID.');
            throw new Error('RFIDTag entity must have a tagID.');
        }

        const recordRepository = AppDataSource.getRepository(RFIDScanRecord);
        console.log('Fetching the latest scan record for tagID: ', rfidTag.tagID);

        // Find the latest scan record for the given tagID
        const latestScanRecord = await recordRepository.findOne({
            where: { tag: { tagID: rfidTag.tagID } },
            relations: ['scanner', 'scanner.node'],
            order: { scanTimestamp: 'DESC' }
        });

        if (!latestScanRecord) {
            console.log('No scan records found for tagID: ', rfidTag.tagID);
            return null;
        }

        console.log('Latest scan record found: ', latestScanRecord);

        // Count the total number of scan records for this tag to determine its 'in' or 'out' status
        const count = await recordRepository.count({ where: { tag: { tagID: rfidTag.tagID } } });
        const isIn = (count % 2) !== 0;

        console.log(`Total scan records for tagID ${rfidTag.tagID}: ${count}, Is in: ${isIn}`);

        // Return the SensorNode ID if the tag is 'in', otherwise return null
        return isIn ? latestScanRecord.scanner.node.nodeID : null;
    } catch (error) {
        console.error("Database error during sensor node determination: ", error);
        throw new Error('Failed to determine sensor node. Please try again later.');
    }
}




  static async updateScanRecord(recordId: number, updatedRecordData: Partial<RFIDScanRecord>): Promise<RFIDScanRecord | null> {
    try {
      const recordRepository = AppDataSource.getRepository(RFIDScanRecord);
      const result = await recordRepository.update(recordId, updatedRecordData);
      if (result.affected !== 1) {
        return null;
      }
      return await recordRepository.findOne({ where: { recordID: recordId } });
    } catch (error) {
      console.error("Database error during scan record update:", error);
      throw new Error('Failed to update scan record. Please try again later.');
    }
  }

  static async deleteScanRecord(recordId: number): Promise<boolean> {
    try {
      const result = await AppDataSource.getRepository(RFIDScanRecord).delete(recordId);
      return !!result.affected;
    } catch (error) {
      console.error("Database error during scan record deletion:", error);
      throw new Error('Failed to delete scan record. Please try again later.');
    }
  }
}

export default RFIDScanRecordService;

import { RFIDScanRecord } from '../src/entity/RFIDScanRecord';
import { AppDataSource } from '../src/data-source';

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

import { QualityRecord, FQCRecord, DataStatusInfo } from '@/types/quality';

/**
 * Interface defining the contract for Quality Data Providers.
 * This allows seamless transition from Dummy Data to Server-Side Excel Adapters.
 */
export interface QualityDataAdapter {
  getAvailableMonths(): Promise<string[]>;
  getQualityRecords(month?: string): Promise<QualityRecord[]>;
  getFQCRecords(month?: string): Promise<FQCRecord[]>;
  getDataStatus(): Promise<DataStatusInfo>;
}

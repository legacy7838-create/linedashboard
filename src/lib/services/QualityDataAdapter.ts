import { QualityRecord, FQCRecord, DataStatusInfo } from '@/types/quality';

/**
 * Interface defining the contract for Quality Data Providers.
 * This allows swapping the default empty source for server-side Excel adapters.
 */
export interface QualityDataAdapter {
  getAvailableMonths(): Promise<string[]>;
  getQualityRecords(month?: string): Promise<QualityRecord[]>;
  getFQCRecords(month?: string): Promise<FQCRecord[]>;
  getDataStatus(): Promise<DataStatusInfo>;
}

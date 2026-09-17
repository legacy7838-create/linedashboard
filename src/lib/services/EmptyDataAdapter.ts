import { QualityDataAdapter } from './QualityDataAdapter';
import { QualityRecord, FQCRecord, DataStatusInfo } from '@/types/quality';

/**
 * Default adapter used before any Excel workbook has been supplied.
 * Returns no records so the portal renders explicit "no data available"
 * states instead of fabricated sample values.
 */
export class EmptyDataAdapter implements QualityDataAdapter {
  async getAvailableMonths(): Promise<string[]> {
    return [];
  }

  async getQualityRecords(): Promise<QualityRecord[]> {
    return [];
  }

  async getFQCRecords(): Promise<FQCRecord[]> {
    return [];
  }

  async getDataStatus(): Promise<DataStatusInfo> {
    return {
      sourceType: 'SAMPLE_DATA',
      rejectionStatus: 'NOT_CONNECTED',
      reworkStatus: 'NOT_CONNECTED',
      fqcStatus: 'NOT_CONNECTED',
      mode: 'INTERNAL',
      lastUpdated: new Date().toISOString(),
      availableMonths: [],
      totalRecordsCount: 0,
    };
  }
}

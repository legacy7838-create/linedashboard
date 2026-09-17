import { QualityDataAdapter } from './QualityDataAdapter';
import { QualityRecord, FQCRecord, DataStatusInfo } from '@/types/quality';
import { DUMMY_QUALITY_RECORDS, DUMMY_FQC_RECORDS } from '@/data/dummyQualityData';

export class DummyDataAdapter implements QualityDataAdapter {
  async getAvailableMonths(): Promise<string[]> {
    const months = new Set<string>();
    DUMMY_QUALITY_RECORDS.forEach(r => months.add(r.month));
    DUMMY_FQC_RECORDS.forEach(r => months.add(r.month));
    return Array.from(months);
  }

  async getQualityRecords(month?: string): Promise<QualityRecord[]> {
    if (!month || month === 'ALL') {
      return [...DUMMY_QUALITY_RECORDS];
    }
    return DUMMY_QUALITY_RECORDS.filter(r => r.month === month);
  }

  async getFQCRecords(month?: string): Promise<FQCRecord[]> {
    if (!month || month === 'ALL') {
      return [...DUMMY_FQC_RECORDS];
    }
    return DUMMY_FQC_RECORDS.filter(r => r.month === month);
  }

  async getDataStatus(): Promise<DataStatusInfo> {
    const months = await this.getAvailableMonths();
    return {
      sourceType: 'SAMPLE_DATA',
      rejectionStatus: 'NOT_CONNECTED',
      reworkStatus: 'NOT_CONNECTED',
      fqcStatus: 'NOT_CONNECTED',
      mode: 'INTERNAL',
      lastUpdated: new Date().toISOString(),
      availableMonths: months,
      totalRecordsCount: DUMMY_QUALITY_RECORDS.length + DUMMY_FQC_RECORDS.length,
    };
  }
}

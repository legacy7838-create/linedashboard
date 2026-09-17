import { QualityDataAdapter } from './QualityDataAdapter';
import { EmptyDataAdapter } from './EmptyDataAdapter';
import { QualityRecord, FQCRecord, DataStatusInfo } from '@/types/quality';

class QualityDataService {
  private adapter: QualityDataAdapter;

  constructor(adapter?: QualityDataAdapter) {
    this.adapter = adapter || new EmptyDataAdapter();
  }

  public setAdapter(adapter: QualityDataAdapter) {
    this.adapter = adapter;
  }

  public async getAvailableMonths(): Promise<string[]> {
    return this.adapter.getAvailableMonths();
  }

  public async getQualityRecords(month?: string): Promise<QualityRecord[]> {
    return this.adapter.getQualityRecords(month);
  }

  public async getFQCRecords(month?: string): Promise<FQCRecord[]> {
    return this.adapter.getFQCRecords(month);
  }

  public async getDataStatus(): Promise<DataStatusInfo> {
    return this.adapter.getDataStatus();
  }
}

export const qualityDataService = new QualityDataService();

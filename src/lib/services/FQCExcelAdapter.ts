import { FQCRecord } from '@/types/quality';

/**
 * Server-Side Adapter Stub for reading FQC Fallout Excel files.
 * Expected structure: LINE QUALITY DATA/<Month>/FQC Fallout.xlsx
 *
 * NOTE: FQC Fallout Excel has a distinct column format from Rejection/Rework.
 * Architecture is completely separated to allow custom column mapping.
 */
export class FQCExcelAdapter {
  private filePath?: string;

  constructor(filePath?: string) {
    this.filePath = filePath;
  }

  async parseExcelFile(): Promise<FQCRecord[]> {
    throw new Error(
      'FQC Fallout Excel parsing is not connected yet. Application is currently running in Sample Data mode.'
    );
  }
}

import { QualityRecord } from '@/types/quality';

/**
 * Server-Side Adapter Stub for reading Rework Excel files.
 * Expected structure: LINE QUALITY DATA/<Month>/Rework.xlsx
 *
 * NOTE: Excel reading is NOT connected yet.
 */
export class ReworkExcelAdapter {
  private filePath?: string;

  constructor(filePath?: string) {
    this.filePath = filePath;
  }

  async parseExcelFile(): Promise<QualityRecord[]> {
    throw new Error(
      'Rework Excel parsing is not connected yet. Application is currently awaiting an Excel upload.'
    );
  }
}

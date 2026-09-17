import { QualityRecord } from '@/types/quality';

/**
 * Server-Side Adapter Stub for reading Rejection Excel files.
 * Expected structure: LINE QUALITY DATA/<Month>/Rejection.xlsx
 *
 * NOTE: Excel reading is NOT connected yet.
 * When activated, this will use a server-side parser (e.g. xlsx/exceljs)
 * inside Next.js Route Handlers to normalize rows into QualityRecord objects.
 */
export class RejectionExcelAdapter {
  private filePath?: string;

  constructor(filePath?: string) {
    this.filePath = filePath;
  }

  async parseExcelFile(): Promise<QualityRecord[]> {
    // Architecture placeholder for future server-side local Excel parsing
    throw new Error(
      'Rejection Excel parsing is not connected yet. Application is currently awaiting an Excel upload.'
    );
  }
}

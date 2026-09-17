import { NextResponse } from 'next/server';
import { qualityDataService } from '@/lib/services/qualityDataService';

export async function GET() {
  try {
    const status = await qualityDataService.getDataStatus();
    return NextResponse.json({ success: true, status });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data status' },
      { status: 500 }
    );
  }
}

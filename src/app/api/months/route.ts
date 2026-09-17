import { NextResponse } from 'next/server';
import { qualityDataService } from '@/lib/services/qualityDataService';

export async function GET() {
  try {
    const months = await qualityDataService.getAvailableMonths();
    return NextResponse.json({ success: true, months });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch available months' },
      { status: 500 }
    );
  }
}

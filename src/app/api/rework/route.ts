import { NextRequest, NextResponse } from 'next/server';
import { qualityDataService } from '@/lib/services/qualityDataService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month') || undefined;

    const records = await qualityDataService.getQualityRecords(month);
    const reworkRecords = records.filter(r => r.type === 'REWORK');

    return NextResponse.json({
      success: true,
      month: month || 'ALL',
      count: reworkRecords.length,
      records: reworkRecords,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rework data' },
      { status: 500 }
    );
  }
}

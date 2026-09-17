import { NextRequest, NextResponse } from 'next/server';
import { qualityDataService } from '@/lib/services/qualityDataService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month') || undefined;

    const records = await qualityDataService.getQualityRecords(month);
    const rejectionRecords = records.filter(r => r.type === 'REJECTION');

    return NextResponse.json({
      success: true,
      month: month || 'ALL',
      count: rejectionRecords.length,
      records: rejectionRecords,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rejection data' },
      { status: 500 }
    );
  }
}

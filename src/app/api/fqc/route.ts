import { NextRequest, NextResponse } from 'next/server';
import { qualityDataService } from '@/lib/services/qualityDataService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month') || undefined;

    const fqcRecords = await qualityDataService.getFQCRecords(month);

    return NextResponse.json({
      success: true,
      month: month || 'ALL',
      count: fqcRecords.length,
      records: fqcRecords,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FQC data' },
      { status: 500 }
    );
  }
}

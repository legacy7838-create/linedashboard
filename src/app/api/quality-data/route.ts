import { NextRequest, NextResponse } from 'next/server';
import { qualityDataService } from '@/lib/services/qualityDataService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month') || undefined;

    const [qualityRecords, fqcRecords] = await Promise.all([
      qualityDataService.getQualityRecords(month),
      qualityDataService.getFQCRecords(month),
    ]);

    return NextResponse.json({
      success: true,
      month: month || 'ALL',
      totalCount: qualityRecords.length + fqcRecords.length,
      records: qualityRecords,
      fqcRecords,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quality data' },
      { status: 500 }
    );
  }
}

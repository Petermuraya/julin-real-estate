import { NextResponse } from 'next/server';
import { getLatestProperties } from '@/domains/property/property.service';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const properties = await getLatestProperties(6);
    return NextResponse.json({ properties });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/infrastructure/database/supabase.client';

// Dev-only route to verify Supabase server (service-role) connectivity.
// WARNING: This endpoint must NOT be enabled in production.
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const { data, error } = await supabaseAdmin.from('blog').select('*').limit(1);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

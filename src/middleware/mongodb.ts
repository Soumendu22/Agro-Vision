import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function middleware() {
  try {
    await dbConnect();
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
}; 
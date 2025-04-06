import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';

export async function middleware() {
  try {
    await dbConnect();
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
}; 
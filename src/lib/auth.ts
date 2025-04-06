import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { id: string };
  } catch (error) {
    return null;
  }
} 
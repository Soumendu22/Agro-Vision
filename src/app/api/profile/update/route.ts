import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import FarmProfile from '@/models/FarmProfile';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: Request) {
  try {
    await dbConnect();

    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Update farm profile
    const farmProfile = await FarmProfile.findOneAndUpdate(
      { userId: decoded.id },
      {
        ...body,
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      farmProfile,
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to update profile',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await dbConnect();
    console.log('DB Connected');

    const body = await req.json();
    const { email, password } = body;
    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      console.log('Missing credentials');
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email }).populate('farmProfile');
    console.log('User search result:', {
      found: !!user,
      hasPassword: !!user?.password,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password (now synchronous)
    const isPasswordCorrect = user.correctPassword(password);
    console.log('Password verification:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Create response object without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      country: user.country,
      region: user.region,
      hasCompletedProfile: user.hasCompletedProfile,
      farmDetails: user.farmProfile,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      status: 'success',
      message: 'Logged in successfully',
      user: userResponse,
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Something went wrong',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 
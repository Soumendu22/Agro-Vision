import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    console.log('DB Connected for signup');

    const body = await req.json();
    const { name, email, password, country, region } = body;
    console.log('Signup attempt for:', email);

    // Validate required fields
    if (!name || !email || !password || !country || !region) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password, // This will be hashed by the pre-save middleware
      country,
      region,
    });

    console.log('User created successfully:', user.email);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return NextResponse.json(
      { message: 'User created successfully', user: userObject },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create account'
      },
      { status: 500 }
    );
  }
} 
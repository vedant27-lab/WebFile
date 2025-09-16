// src/app/api/auth/signin/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, confirmPassword } = body;

    // --- Basic Validation ---
    if (!firstName || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }
    
    // --- Simulate Database Interaction ---
    // In a real app, you would hash the password and save the user to a database here.
    console.log(`[API] Registering new user: ${email}`);
    // const newUser = await db.user.create({ data: { ... } });

    // --- Return Success Response ---
    return NextResponse.json(
      { message: 'User registered successfully!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('[SIGNIN_API_ERROR]', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
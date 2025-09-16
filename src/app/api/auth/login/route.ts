// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // --- Basic Validation ---
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // --- Simulate Database User Check ---
    // In a real app, you'd find the user in the DB and compare hashed passwords.
    console.log(`[API] Attempting login for: ${email}`);
    
    // This is our mock user database.
    const MOCK_USER = {
      email: 'test@example.com',
      password: 'password123', // In reality, this would be a hashed password
      name: 'Test User',
    };

    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      // --- Login Successful ---
      const user = { email: MOCK_USER.email, name: MOCK_USER.name };
      return NextResponse.json({ message: 'Login successful', user });
    } else {
      // --- Login Failed ---
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 } // 401 Unauthorized
      );
    }

  } catch (error) {
    console.error('[LOGIN_API_ERROR]', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
export const runtime = 'nodejs'

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Deconectare reușită' },
    { status: 200 }
  );

  // Clear the auth cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    //secure: process.env.NODE_ENV === 'production',
	secure: process.env.SECURE_LOGIN === "true",
    sameSite: 'strict',
    maxAge: 0,
  });

  return response;
}

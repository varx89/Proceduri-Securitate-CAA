export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { authCookieOptions } from '../../../../lib/auth';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Deconectare reușită' },
    { status: 200 }
  );

  // Clear the auth cookie
  response.cookies.set('auth-token', '', {
    ...authCookieOptions,
    maxAge: 0,
  });

  return response;
}

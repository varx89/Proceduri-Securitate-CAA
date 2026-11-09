export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server';
import { User, ensureDb } from '../../../../models';
import { comparePassword, generateToken, authCookieOptions, AUTH_COOKIE_MAX_AGE } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username și parola sunt obligatorii' },
        { status: 400 }
      );
    }

    await ensureDb();

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { message: 'Credențiale invalide' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Credențiale invalide' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user.id);

    const response = NextResponse.json(
      { message: 'Autentificare reușită' },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      ...authCookieOptions,
      maxAge: AUTH_COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Eroare internă' },
      { status: 500 }
    );
  }
}

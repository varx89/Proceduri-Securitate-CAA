export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Token lipsă' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Token invalid' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Token valid', userId: decoded.userId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { message: 'Eroare la verificarea token-ului' },
      { status: 500 }
    );
  }
}

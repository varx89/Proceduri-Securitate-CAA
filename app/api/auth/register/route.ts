export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server';
import { User, ensureDb } from '../../../../models';
import { hashPassword } from '../../../../lib/auth';
import { isRegisterSlug } from '../../../../lib/register';

export async function POST(request: NextRequest) {
  try {
    const { key, username, password } = await request.json();

    // Only callable from the secret register page
    if (!isRegisterSlug(key)) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const name = typeof username === 'string' ? username.trim() : '';
    if (!name || typeof password !== 'string') {
      return NextResponse.json(
        { message: 'Username și parola sunt obligatorii' },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Parola trebuie să aibă minim 8 caractere' },
        { status: 400 }
      );
    }

    await ensureDb();

    const existing = await User.findOne({ where: { username: name } });
    if (existing) {
      return NextResponse.json(
        { message: 'Utilizatorul există deja' },
        { status: 409 }
      );
    }

    await User.create({ username: name, password: await hashPassword(password) });

    return NextResponse.json({ message: 'Utilizator creat' }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Eroare internă' },
      { status: 500 }
    );
  }
}

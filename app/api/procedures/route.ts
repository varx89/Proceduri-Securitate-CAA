export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import Procedure from '../../../models/Procedure';

export async function GET() {
  try {
    const procedures = await Procedure.findAll({
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(procedures);
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return NextResponse.json(
      { message: 'Eroare la încărcarea procedurilor' },
      { status: 500 }
    );
  }
}

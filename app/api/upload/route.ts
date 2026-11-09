export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import Procedure from '../../../models/Procedure';
import { verifyToken } from '../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Neautorizat' },
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file || !category || !title || !description) {
      return NextResponse.json(
        { message: 'Toate câmpurile sunt obligatorii' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { message: 'Doar fișierele PDF sunt acceptate' },
        { status: 400 }
      );
    }

    // Create uploads directory inside public for static serving
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {}

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = (file as any).name?.toString?.() || 'document.pdf';
    const fileName = `${timestamp}_${safeName}`;
    const diskPath = path.join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(diskPath, buffer);

    // Public URL path
    const publicPath = `/uploads/${fileName}`;

    // Save to database
    const procedure = await Procedure.create({
      title,
      description,
      category,
      filePath: publicPath,
      fileName,
    });

    return NextResponse.json(
      { 
        message: 'Fișier încărcat cu succes',
        procedure 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Eroare la încărcarea fișierului' },
      { status: 500 }
    );
  }
}

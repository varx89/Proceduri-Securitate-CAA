export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { resolveUploadPath } from '../../../lib/uploads';

// Serves uploaded PDFs from UPLOAD_DIR at the same /uploads/<file> URLs stored in the database
export async function GET(_request: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const diskPath = resolveUploadPath(file);
  if (!diskPath || !diskPath.toLowerCase().endsWith('.pdf')) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const data = await readFile(diskPath);
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}

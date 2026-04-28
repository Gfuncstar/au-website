import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') return NextResponse.json({ error: 'dev only' }, { status: 403 });
  const { path, content } = await req.json();
  const full = join(process.cwd(), path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf-8');
  return NextResponse.json({ ok: true, path: full });
}

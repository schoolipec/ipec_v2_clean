import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOCALES = ['en', 'es', 'pt', 'ko', 'de'] as const;
type Locale = (typeof LOCALES)[number];

const messagesDir = path.join(process.cwd(), 'src', 'i18n', 'messages');

function readLocale(locale: Locale): Record<string, unknown> {
  const filePath = path.join(messagesDir, `${locale}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeLocale(locale: Locale, data: Record<string, unknown>): void {
  const filePath = path.join(messagesDir, `${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// GET /api/admin/content?section=hero → returns { en: {...}, es: {...}, ... }
export async function GET(request: NextRequest) {
  const section = request.nextUrl.searchParams.get('section');
  if (!section) {
    return NextResponse.json({ error: 'Falta el parámetro section.' }, { status: 400 });
  }

  const result: Partial<Record<Locale, Record<string, unknown>>> = {};
  for (const locale of LOCALES) {
    const full = readLocale(locale);
    result[locale] = (full[section] as Record<string, unknown>) ?? {};
  }

  return NextResponse.json(result);
}

// PUT /api/admin/content  body: { section, locale, data }
export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Body inválido.' }, { status: 400 });

  const { section, locale, data } = body as {
    section?: string;
    locale?: Locale;
    data?: Record<string, unknown>;
  };

  if (!section || !locale || !data) {
    return NextResponse.json({ error: 'Faltan campos: section, locale, data.' }, { status: 400 });
  }
  if (!LOCALES.includes(locale)) {
    return NextResponse.json({ error: `Locale inválido: ${locale}` }, { status: 400 });
  }

  const full = readLocale(locale);
  full[section] = data;
  writeLocale(locale, full);

  return NextResponse.json({ ok: true });
}

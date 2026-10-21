import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendPrayerToInbox, sendPrayerNotificationEmail } from '@/lib/email';
import { notifyPrayerRequest } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { name, request } = await req.json();

    if (!name || !request) {
      return NextResponse.json({ error: 'Name and request are required' }, { status: 400 });
    }

    // 1. Guardar en DB siempre
    const saved = await prisma.prayerRequest.create({
      data: { name, request, source: 'website' },
    });

    // 2. Todo lo que sigue es fire-and-forget (no bloquea la respuesta)
    Promise.all([
      // 2a. Webhook n8n (opcional)
      ...(process.env.N8N_PRAYER_WEBHOOK_URL ? [
        fetch(process.env.N8N_PRAYER_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: saved.id, name, request, timestamp: saved.createdAt.toISOString(), source: 'ipec-website' }),
        }).catch(err => console.warn('[prayer] webhook n8n falló, id:', saved.id, err)),
      ] : []),

      // 2b. Correo a peticiones@suplenitud.com (siempre que haya SMTP)
      sendPrayerToInbox(name, request, saved.id).catch(err =>
        console.warn('[prayer] correo a inbox falló, id:', saved.id, err)
      ),

      // 2c. Notificaciones por usuario (Telegram + email personal)
      prisma.user.findMany({
        where: {
          OR: [
            { notifyTelegramPrayer: true, telegramId: { not: null } },
            { notifyEmailPrayer: true },
          ],
        },
        select: { email: true, telegramId: true, notifyTelegramPrayer: true, notifyEmailPrayer: true },
      }).then(users => Promise.all(
        users.flatMap(u => {
          const jobs = [];
          if (u.notifyTelegramPrayer && u.telegramId) {
            jobs.push(
              notifyPrayerRequest(name, request, saved.id, u.telegramId).catch(err =>
                console.warn('[prayer] Telegram falló para', u.telegramId, err)
              )
            );
          }
          if (u.notifyEmailPrayer) {
            jobs.push(
              sendPrayerNotificationEmail(u.email, name, request, saved.id).catch(err =>
                console.warn('[prayer] email personal falló para', u.email, err)
              )
            );
          }
          return jobs;
        })
      )).catch(err => console.warn('[prayer] error en notificaciones por usuario:', err)),
    ]).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[prayer route]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

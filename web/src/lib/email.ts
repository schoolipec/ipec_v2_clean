import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = process.env.SMTP_FROM || 'no-reply@suplenitud.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const PRAYER_INBOX = process.env.PRAYER_EMAIL_INBOX || 'peticiones@suplenitud.com'

export async function sendPrayerNotificationEmail(
  toEmail: string,
  name: string,
  request: string,
  prayerRequestId: string,
) {
  const adminUrl = `${SITE_URL}/admin/prayer-requests`
  const isDefault = toEmail === PRAYER_INBOX

  await transporter.sendMail({
    from: `"IPEC — Pedidos de Oración" <${FROM}>`,
    to: toEmail,
    subject: `Nueva petición de oración de ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:32px;border-radius:12px;">
        <div style="background:linear-gradient(135deg,#1565C0 0%,#2E7D32 100%);padding:20px 24px;border-radius:8px;margin-bottom:24px;">
          <h1 style="color:white;margin:0;font-size:18px;">✝ Nueva Petición de Oración</h1>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">Iglesia Plenitud en Cristo</p>
        </div>
        <div style="background:white;padding:28px;border-radius:8px;border:1px solid #e2e8f0;">
          <p style="color:#475569;margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">De</p>
          <p style="color:#1e293b;font-size:16px;font-weight:700;margin:0 0 20px;">${name}</p>
          <p style="color:#475569;margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Petición</p>
          <div style="background:#f8fafc;border-left:4px solid #1565C0;padding:14px 16px;border-radius:0 6px 6px 0;color:#334155;line-height:1.6;font-size:15px;margin:0 0 24px;">
            ${request.replace(/\n/g, '<br>')}
          </div>
          ${isDefault ? `
          <div style="text-align:center;">
            <a href="${adminUrl}" style="background:linear-gradient(135deg,#1565C0 0%,#2E7D32 100%);color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block;">
              Ver en el panel admin
            </a>
          </div>` : ''}
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin:20px 0 0;">
            ID: ${prayerRequestId} · ${new Date().toLocaleString('es-MX', { timeZone: 'America/Los_Angeles' })}
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendPrayerToInbox(name: string, request: string, id: string) {
  if (!process.env.SMTP_USER) return
  await sendPrayerNotificationEmail(PRAYER_INBOX, name, request, id)
}

export async function sendInvitationEmail(
  toEmail: string,
  invitedByName: string,
  token: string
) {
  const acceptUrl = `${SITE_URL}/admin/accept-invitation?token=${token}`

  await transporter.sendMail({
    from: `"IPEC Admin" <${FROM}>`,
    to: toEmail,
    subject: 'Invitación al Panel de Administración — Iglesia Plenitud en Cristo',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #1565C0 0%, #2E7D32 100%); padding: 24px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Iglesia Plenitud en Cristo</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Panel de Administración</p>
        </div>

        <div style="background: white; padding: 32px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 16px;">Has sido invitado al panel administrativo</h2>

          <p style="color: #475569; line-height: 1.6;">
            <strong>${invitedByName}</strong> te ha invitado a acceder al panel de administración de la Iglesia Plenitud en Cristo.
          </p>

          <p style="color: #475569; line-height: 1.6;">
            Haz clic en el botón de abajo para aceptar la invitación y crear tu contraseña:
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${acceptUrl}" style="background: linear-gradient(135deg, #1565C0 0%, #2E7D32 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
              Aceptar Invitación
            </a>
          </div>

          <p style="color: #94a3b8; font-size: 13px; text-align: center;">
            Este enlace expira en 48 horas. Si no esperabas esta invitación, ignora este correo.
          </p>

          <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 16px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              O copia este enlace: <a href="${acceptUrl}" style="color: #1565C0;">${acceptUrl}</a>
            </p>
          </div>
        </div>
      </div>
    `,
  })
}

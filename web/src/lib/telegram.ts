const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function sendTelegramMessage(chatId: string, text: string) {
  if (!BOT_TOKEN) return
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

export async function notifyPrayerRequest(
  name: string,
  request: string,
  prayerRequestId: string,
  chatId: string,
) {
  const preview = request.length > 200 ? request.slice(0, 200) + '…' : request
  const text =
    `✝ <b>Nueva petición de oración</b>\n\n` +
    `<b>De:</b> ${name}\n\n` +
    `<b>Petición:</b>\n${preview}\n\n` +
    `<i>ID: ${prayerRequestId}</i>`
  await sendTelegramMessage(chatId, text)
}

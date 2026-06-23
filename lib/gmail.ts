/**
 * lib/gmail.ts
 * Sends an email via the Gmail API using the user's stored OAuth access token.
 */
export async function sendGmailNotification({
  accessToken,
  toEmail,
  taskTitle,
  taskTime,
  taskNotes,
}: {
  accessToken: string
  toEmail: string
  taskTitle: string
  taskTime: string
  taskNotes?: string | null
}) {
  const subject = `⏰ DayNest Reminder: ${taskTitle}`
  const body = [
    `Hi there! 🌿`,
    ``,
    `This is your DayNest reminder for:`,
    ``,
    `📌 Task: ${taskTitle}`,
    `🕐 Time: ${taskTime}`,
    taskNotes ? `📝 Notes: ${taskNotes}` : '',
    ``,
    `Have a calm and productive day! ☕`,
    `– DayNest`,
  ]
    .filter(Boolean)
    .join('\n')

  const message = [
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join('\n')

  const encoded = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encoded }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[Gmail] Failed to send:', err)
    throw new Error(`Gmail API error: ${err}`)
  }

  console.log(`[Gmail] Notification sent to ${toEmail} for task "${taskTitle}"`)
}

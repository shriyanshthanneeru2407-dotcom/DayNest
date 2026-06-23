/**
 * lib/twilio.ts
 * Sends an SMS reminder via Twilio REST API.
 */
export async function sendSmsNotification({
  toPhone,
  taskTitle,
  taskTime,
}: {
  toPhone: string
  taskTitle: string
  taskTime: string
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!
  const authToken = process.env.TWILIO_AUTH_TOKEN!
  const fromPhone = process.env.TWILIO_PHONE_NUMBER!

  if (!accountSid || !authToken || !fromPhone) {
    console.warn('[Twilio] Missing credentials, skipping SMS.')
    return
  }

  const body = `⏰ DayNest Reminder: "${taskTitle}" is coming up at ${taskTime}. Have a calm day! 🌿`

  const params = new URLSearchParams({
    From: fromPhone,
    To: toPhone,
    Body: body,
  })

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('[Twilio] Failed to send SMS:', err)
    throw new Error(`Twilio error: ${err}`)
  }

  console.log(`[Twilio] SMS sent to ${toPhone} for task "${taskTitle}"`)
}

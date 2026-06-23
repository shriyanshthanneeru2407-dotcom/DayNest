/**
 * lib/scheduler.ts
 * Background cron job that fires every minute, checks for tasks due soon,
 * and sends Gmail + SMS notifications.
 *
 * This module is imported once in the Next.js instrumentation hook.
 */
import cron from 'node-cron'
import { prisma } from './prisma'
import { sendGmailNotification } from './gmail'
import { sendSmsNotification } from './twilio'

let started = false

export function startScheduler() {
  if (started) return
  started = true

  console.log('[DayNest Scheduler] Started ✅')

  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date()
      const tasks = await prisma.task.findMany({
        where: {
          completed: false,
          notified: false,
          date: { not: null },
          time: { not: null },
        },
        include: {
          user: {
            include: {
              accounts: true,
            },
          },
        },
      })

      for (const task of tasks) {
        if (!task.date || !task.time) continue

        const taskDateTime = new Date(`${task.date}T${task.time}:00`)
        const notifyMinutes = task.user.notifyMinutes ?? 15
        const notifyAt = new Date(taskDateTime.getTime() - notifyMinutes * 60 * 1000)

        // Check if we're within a 1-minute window of the notification time
        const diff = Math.abs(now.getTime() - notifyAt.getTime())
        if (diff > 60 * 1000) continue // not yet (or missed)

        console.log(`[Scheduler] Notifying for task: "${task.title}"`)

        const user = task.user
        const timeStr = new Date(`1970-01-01T${task.time}:00`).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })

        // Gmail notification
        if (user.email) {
          const googleAccount = user.accounts.find((a) => a.provider === 'google')
          if (googleAccount?.access_token) {
            try {
              await sendGmailNotification({
                accessToken: googleAccount.access_token,
                toEmail: user.email,
                taskTitle: task.title,
                taskTime: timeStr,
                taskNotes: task.notes,
              })
            } catch (e) {
              console.error('[Scheduler] Gmail error:', e)
            }
          }
        }

        // SMS notification
        if (user.phoneNumber) {
          try {
            await sendSmsNotification({
              toPhone: user.phoneNumber,
              taskTitle: task.title,
              taskTime: timeStr,
            })
          } catch (e) {
            console.error('[Scheduler] SMS error:', e)
          }
        }

        // Mark as notified
        await prisma.task.update({
          where: { id: task.id },
          data: { notified: true },
        })
      }
    } catch (err) {
      console.error('[Scheduler] Error:', err)
    }
  })
}

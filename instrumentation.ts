// instrumentation.ts — Next.js 14 instrumentation hook
// This runs once when the server starts and boots the scheduler.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startScheduler } = await import('./lib/scheduler')
    startScheduler()
  }
}

// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      ...(date ? { date } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, notes, date, time, priority, category } = body

  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const task = await prisma.task.create({
    data: {
      userId: session.user.id,
      title,
      notes: notes || null,
      date: date || null,
      time: time || null,
      priority: priority || 'medium',
      category: category || 'Personal',
    },
  })

  return NextResponse.json(task, { status: 201 })
}

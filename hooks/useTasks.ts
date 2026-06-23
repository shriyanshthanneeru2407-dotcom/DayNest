// hooks/useTasks.ts
'use client'
import { useState, useEffect, useCallback } from 'react'

interface Task {
  id: string
  title: string
  notes?: string
  date?: string
  time?: string
  priority: string
  category: string
  completed: boolean
}

export default function useTasks(date?: string) {
  const [tasks,   setTasks]   = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const url = date ? `/api/tasks?date=${date}` : '/api/tasks'
    const res  = await fetch(url)
    const data = await res.json()
    setTasks(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [date])

  useEffect(() => { refresh() }, [refresh])

  const toggle = useCallback(async (id: string, completed: boolean) => {
    setTasks(t => t.map(task => task.id === id ? { ...task, completed } : task))
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })
  }, [])

  const remove = useCallback(async (id: string) => {
    setTasks(t => t.filter(task => task.id !== id))
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  }, [])

  return { tasks, loading, refresh, toggle, remove }
}

// hooks/useTasks.ts
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface Task {
  id: string
  title: string
  notes?: string
  date?: string
  time?: string
  priority: string
  category: string
  completed: boolean
}

// ── Guest localStorage helpers ─────────────────────────────────────
const STORAGE_KEY = 'daynest_guest_tasks'

function loadGuestTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveGuestTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ── Hook ───────────────────────────────────────────────────────────
export default function useTasks(date?: string) {
  const { data: session, status } = useSession()
  const isGuest = status !== 'loading' && !session

  const [tasks,   setTasks]   = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // ── Refresh ──────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    setLoading(true)
    if (isGuest) {
      // Guest: read from localStorage
      const all = loadGuestTasks()
      setTasks(date ? all.filter(t => t.date === date) : all)
      setLoading(false)
    } else {
      // Signed-in: fetch from API
      const url = date ? `/api/tasks?date=${date}` : '/api/tasks'
      try {
        const res  = await fetch(url)
        const data = await res.json()
        setTasks(Array.isArray(data) ? data : [])
      } catch { setTasks([]) }
      setLoading(false)
    }
  }, [date, isGuest])

  useEffect(() => {
    if (status !== 'loading') refresh()
  }, [refresh, status])

  // ── Toggle ───────────────────────────────────────────────────────
  const toggle = useCallback(async (id: string, completed: boolean) => {
    setTasks(t => t.map(task => task.id === id ? { ...task, completed } : task))
    if (isGuest) {
      const all = loadGuestTasks().map(t => t.id === id ? { ...t, completed } : t)
      saveGuestTasks(all)
    } else {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
    }
  }, [isGuest])

  // ── Remove ───────────────────────────────────────────────────────
  const remove = useCallback(async (id: string) => {
    setTasks(t => t.filter(task => task.id !== id))
    if (isGuest) {
      saveGuestTasks(loadGuestTasks().filter(t => t.id !== id))
    } else {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    }
  }, [isGuest])

  // ── Add (used by AddTaskModal for guest) ─────────────────────────
  const addGuestTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: newId() }
    const all = [...loadGuestTasks(), newTask]
    saveGuestTasks(all)
    setTasks(prev => date
      ? (newTask.date === date ? [...prev, newTask] : prev)
      : [...prev, newTask]
    )
  }, [date])

  return { tasks, loading, refresh, toggle, remove, addGuestTask, isGuest }
}

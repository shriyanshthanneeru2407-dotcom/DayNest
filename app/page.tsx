import { redirect } from 'next/navigation'

// Everyone goes to /today — guests work with localStorage, signed-in users use the DB
export default function Home() {
  redirect('/today')
}

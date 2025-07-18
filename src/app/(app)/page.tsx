// src/app/(app)/page.tsx
import { redirect } from 'next/navigation'

export default function AppHome() {
  // Redirect to dashboard as the default app page
  redirect('/dashboard')
}
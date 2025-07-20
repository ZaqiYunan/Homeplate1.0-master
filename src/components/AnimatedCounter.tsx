"use client"

import { useEffect, useState } from "react"

interface AnimatedCounterProps {
  end: number
  duration?: number
  start?: number
}

export function AnimatedCounter({ end, duration = 2000, start = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(start)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) return

    const increment = (end - start) / (duration / 16)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, start, duration, hasStarted])

  useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return <span>{Math.floor(count)}</span>
} 
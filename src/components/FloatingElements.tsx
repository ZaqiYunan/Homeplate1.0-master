"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Vegetables */}
      <div
        className="absolute w-8 h-8 text-2xl animate-bounce"
        style={{
          top: "20%",
          left: "10%",
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          animationDelay: "0s",
        }}
      >
        🥕
      </div>

      <div
        className="absolute w-8 h-8 text-2xl animate-bounce"
        style={{
          top: "60%",
          right: "15%",
          transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`,
          animationDelay: "1s",
        }}
      >
        🥬
      </div>

      <div
        className="absolute w-8 h-8 text-2xl animate-bounce"
        style={{
          top: "40%",
          left: "5%",
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * -0.01}px)`,
          animationDelay: "2s",
        }}
      >
        🍅
      </div>

      <div
        className="absolute w-8 h-8 text-2xl animate-bounce"
        style={{
          top: "80%",
          right: "25%",
          transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.02}px)`,
          animationDelay: "0.5s",
        }}
      >
        🌶️
      </div>

      {/* Geometric Shapes */}
      <div
        className="absolute w-16 h-16 bg-accent/10 rounded-full animate-pulse-slow"
        style={{
          top: "30%",
          right: "10%",
          transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
        }}
      />

      <div
        className="absolute w-12 h-12 bg-primary/10 rounded-lg rotate-45 animate-pulse-slow"
        style={{
          top: "70%",
          left: "20%",
          transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * 0.008}px) rotate(45deg)`,
          animationDelay: "1s",
        }}
      />

      <div
        className="absolute w-20 h-20 border-2 border-accent/20 rounded-full animate-spin"
        style={{
          top: "15%",
          right: "30%",
          transform: `translate(${mousePosition.x * 0.003}px, ${mousePosition.y * -0.003}px)`,
          animationDuration: "20s",
        }}
      />
    </div>
  )
} 
"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeInit() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    document.body.classList.add("dark")
  }, [])

  return null
} 
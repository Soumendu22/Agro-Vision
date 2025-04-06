"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: { children: React.ReactNode } & Parameters<typeof NextThemesProvider>[0]) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 
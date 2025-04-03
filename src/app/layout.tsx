"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChatBot } from "@/components/ChatBot";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // If user is on landing page, redirect based on profile completion
      if (pathname === '/') {
        if (!user.hasCompletedProfile) {
          router.push('/complete-profile');
        } else {
          router.push('/dashboard');
        }
      }
      
      // If user hasn't completed profile and isn't on complete-profile page
      if (!user.hasCompletedProfile && pathname !== '/complete-profile') {
        router.push('/complete-profile');
      }
    }
  }, [pathname, router]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <ChatBot />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}

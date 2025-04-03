"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AuthModal } from "./auth/auth-forms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Features", href: "features" },
  { name: "About", href: "about" },
  { name: "Docs", href: "docs" },
  { name: "Examples", href: "examples" }
];

export function Navbar() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: "login" | "signup";
  }>({
    isOpen: false,
    type: "login",
  });

  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 w-full bg-neutral-900/70 backdrop-blur-xl"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex-shrink-0 ml-4">
            <Link className="flex items-center justify-center space-x-2 group" href="/">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-2 rounded-xl bg-gradient-to-r from-green-900/20 to-blue-900/20 group-hover:scale-110 transition-transform"
              >
                <Sprout className="h-6 w-6 text-green-400" />
              </motion.div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 group-hover:from-green-500 group-hover:to-blue-500 transition-all">
                Agro Vision
              </span>
            </Link>
          </div>

          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <div className="flex items-center justify-center space-x-8">
              {user ? (
                <>
                  <NavLink href="/dashboard" label="Dashboard" />
                  <NavLink href="/analytics" label="Analytics" />
                  <NavLink href="/settings" label="Settings" />
                </>
              ) : (
                navItems.map((item) => (
                  <NavLink 
                    key={item.name}
                    href={`#${item.href}`}
                    label={item.name}
                    onClick={(e) => handleScroll(e, item.href)}
                  />
                ))
              )}
            </div>
          </nav>

          <div className="flex items-center space-x-4 mr-4">
            {user ? (
              <>
                <div className="flex items-center space-x-4">
                  <span className="text-neutral-300">Welcome, {user.name}</span>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white rounded-full"
                    onClick={handleDashboard}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-neutral-800 hover:bg-neutral-800 text-neutral-300"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white rounded-full px-6"
                  onClick={() => setAuthModal({ isOpen: true, type: "login" })}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-neutral-800 hover:bg-neutral-800 text-neutral-300"
                  onClick={() => setAuthModal({ isOpen: true, type: "signup" })}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <AuthModal 
        isOpen={authModal.isOpen}
        type={authModal.type}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
      />
    </>
  );
}

function NavLink({ 
  href, 
  label, 
  onClick 
}: { 
  href: string; 
  label: string; 
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-neutral-300 hover:text-green-400 transition-colors relative group cursor-pointer"
    >
      {label}
      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform" />
    </a>
  );
} 
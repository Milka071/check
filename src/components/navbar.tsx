"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Home, Calendar, Library, Settings, Sparkles, LogOut, LogIn } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut } = useSupabase();

  const navItems = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/calendar", label: "Календарь", icon: Calendar },
    { href: "/library", label: "Библиотека", icon: Library },
    { href: "/settings", label: "Настройки", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
              <Sparkles className="h-6 w-6 text-primary" />
              <span>Библиотека Процедур</span>
            </Link>
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {session ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {session.user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Выйти</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4" />
                  <span className="ml-2">Войти</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
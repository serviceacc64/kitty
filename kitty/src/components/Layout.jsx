import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, History, Users } from "lucide-react";
import { cn } from "../lib/utils";
import { Toaster } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { label: "Overview", path: "/", icon: LayoutDashboard },
    { label: "Contribute", path: "/add", icon: PlusCircle },
    { label: "History", path: "/history", icon: History },
    { label: "Members", path: "/members", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-24 flex-col items-center py-10 gap-10 glass border-r border-border/50 sticky top-0 h-screen">
        <Link to="/" className="group flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-rainbow flex items-center justify-center text-white font-black text-2xl shadow-elegant transition-transform group-hover:scale-110 duration-500">
            K
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rainbow">Kitty</span>
        </Link>


        <nav className="flex flex-col gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "p-4 rounded-2xl transition-all duration-300 relative group",
                  isActive 
                    ? "bg-primary text-white shadow-elegant scale-110" 
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
                title={item.label}
              >
                <Icon size={24} strokeWidth={2.5} />
                {!isActive && (
                  <span className="absolute left-20 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rainbow flex items-center justify-center text-white font-black text-xl shadow-elegant">
              K
            </div>
            <span className="text-xl font-black tracking-tight text-rainbow">Kitty</span>
          </Link>
          <ThemeToggle />
        </header>

        <main className="container max-w-5xl mx-auto px-6 py-10 pb-32 md:pb-10">
          {children}
        </main>

        {/* Mobile Nav Dock */}
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass px-4 py-3 rounded-3xl flex items-center gap-2 shadow-2xl border border-white/20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "bg-primary text-white shadow-elegant scale-105" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={22} strokeWidth={2.5} />
                {isActive && <span className="text-xs font-bold tracking-wide">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <Toaster position="top-center" expand={false} richColors closeButton />
    </div>
  );
};


export default Layout;

"use client";

import { Search, Bell, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function TopBar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-surface-border bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search vault..."
            className="w-full bg-surface border border-surface-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-text-secondary hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-surface-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.displayName || "User"}</p>
            <p className="text-xs text-text-secondary">{user?.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/20 flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
        </div>
      </div>
    </header>
  );
}

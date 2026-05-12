"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Key, 
  FileText, 
  BarChart3, 
  Settings, 
  PlusCircle, 
  LogOut,
  Users
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

const navItems = [
  { name: "All Items", icon: Key, href: "/dashboard" },
  { name: "Documents", icon: FileText, href: "/dashboard/documents" },
  { name: "Security", icon: BarChart3, href: "/dashboard/security" },
  { name: "Organizations", icon: Users, href: "/dashboard/organizations" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

import { useDashboard } from "@/contexts/DashboardContext";

export function Sidebar() {
  const pathname = usePathname();
  const { openAddModal } = useDashboard();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      window.location.href = "/";
    }
  };

  return (
    <aside className="w-64 border-r border-surface-border bg-[#0d121f]/50 backdrop-blur-2xl flex flex-col z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            FortiPass
          </span>
        </div>

        <button 
          onClick={openAddModal}
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] mb-6"
        >
          <PlusCircle className="w-5 h-5" />
          Add Item
        </button>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-text-secondary hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-surface-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

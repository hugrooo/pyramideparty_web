"use client";

import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-bg-dark">
      <Sidebar />
      {/* md:ml-64 pour la sidebar sur desktop, pb-24 sur mobile pour la BottomNav */}
      <main className={`flex-1 flex flex-col transition-all duration-300 pb-24 md:pb-0 ${user ? 'md:ml-64' : ''}`}>
        {children}
      </main>
    </div>
  );
}

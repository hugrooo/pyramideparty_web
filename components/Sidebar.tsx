"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, 
  Store, 
  Trophy, 
  UserCircle, 
  BookOpen, 
  Shield, 
  Newspaper,
  LogOut,
  Gift,
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import useSound from "use-sound";
import PromoCodeModal from "./PromoCodeModal";
import { useState } from "react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  
  // Sounds
  const [playHover] = useSound('/sounds/whoosh.mp3', { volume: 0.15 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.3 });

  if (!user) return null; // Ne pas afficher la sidebar si non connecté

  const navItems = [
    { name: "Dashboard", href: "/play", icon: Home },
    { name: "Boutique", href: "/shop", icon: Store },
    { name: "Classement", href: "/leaderboards", icon: Trophy },
    { name: "Mon Profil", href: `/user/${user.uid}`, icon: UserCircle },
    { name: "Squads", href: "/squads", icon: Shield },
    { name: "Partenariat BDE", href: "/bde", icon: GraduationCap },
    { name: "Règles du Jeu", href: "/rules", icon: BookOpen },
    { name: "Actualités", href: "/news", icon: Newspaper },
  ];

  return (
    <>
      <PromoCodeModal isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} />
      
      {/* --- DESKTOP SIDEBAR --- */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-bg-dark/80 backdrop-blur-xl border-r border-white/10 z-50 flex-col pt-8 pb-6 px-4"
      >
        {/* Logo Area */}
        <div className="flex items-center justify-center mb-10">
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-purple flex flex-col items-center leading-none">
            <span>PYRAMIDE</span>
            <span className="text-white text-lg">PARTY</span>
          </div>
        </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all
                ${isActive 
                  ? "bg-gradient-to-r from-primary-cyan/20 to-primary-purple/20 text-white border border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.1)]" 
                  : "text-text-secondary hover:text-white hover:bg-white/5"
                }
              `}
            >
              <Icon size={20} className={isActive ? "text-primary-cyan" : ""} />
              {item.name}
            </Link>
          );
        })}
      </nav>

        {/* Footer Area / Logout */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => { playClick(); setIsPromoOpen(true); }}
            onMouseEnter={() => playHover()}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary-orange/80 to-primary-pink/80 hover:from-primary-orange hover:to-primary-pink transition-all shadow-[0_0_15px_rgba(255,184,0,0.3)] hover:scale-[1.02]"
          >
            <Gift size={20} className="animate-pulse" />
            Entrer un Code
          </button>
          
          <button
            onClick={() => { playClick(); logout(); }}
            onMouseEnter={() => playHover()}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-primary-pink/80 hover:text-primary-pink hover:bg-primary-pink/10 transition-all border border-transparent hover:border-primary-pink/20"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </motion.aside>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-dark/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 py-3 pb-safe">
        {navItems.slice(0, 5).map((item) => {
          // Sur mobile, on n'affiche que les 5 raccourcis principaux pour la place
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => playClick()}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                ${isActive ? "text-primary-cyan" : "text-text-muted hover:text-white"}
              `}
            >
              <Icon size={24} className={isActive ? "drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" : ""} />
              <span className="text-[10px] font-bold">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

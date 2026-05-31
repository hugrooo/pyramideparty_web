"use client";

import { motion } from "framer-motion";
import { User, LogOut, Wallet, Trophy, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";
import Lanyard from "@/components/Lanyard";
import RealtimeLeaderboard from "@/components/RealtimeLeaderboard";
import PlayerDashboard from "@/components/PlayerDashboard";
import SipLeaderboard from "@/components/SipLeaderboard";


export default function Home() {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Stagger animation for leaderboard
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <main className="min-h-screen bg-bg-dark flex flex-col relative overflow-hidden font-sans">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-purple/20 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-cyan/15 rounded-full blur-[150px] -z-10" />
      
      {/* Navigation */}
      <nav className="w-full px-8 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
          <span className="text-xl font-black tracking-widest text-white uppercase hidden sm:block">Pyramide Party</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 font-semibold text-sm text-text-secondary uppercase tracking-wider">
            <a href="#" className="hover:text-white transition-colors">À propos</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Récompenses</a>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-bg-card/50 rounded-full border border-primary-purple/30 glow-purple">
                <div className="w-6 h-6 rounded-full bg-primary-purple/20 flex items-center justify-center text-primary-purple">
                  <User size={14} />
                </div>
                <span className="text-white font-bold text-sm hidden sm:block">{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              <button onClick={logout} className="p-2 text-text-muted hover:text-red-400 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 rounded-full bg-primary-purple/20 text-white font-bold border border-primary-purple glow-btn transition-all flex items-center gap-2"
            >
              <User size={16} />
              Connexion
            </button>
          )}
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8 lg:py-12 flex flex-col xl:flex-row gap-8 items-stretch justify-center z-10">
        
        {/* LEFT PANEL: Action Area or Player Dashboard */}
        {user ? (
          <PlayerDashboard user={user} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-panel flex-1 flex flex-col items-center pt-16 pb-0 px-8 relative min-h-[600px]"
          >
            <div className="text-center z-20 max-w-md">
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-lg">
                Connectez-vous <br/>Pour Rejoindre<br/>Une Partie !
              </h1>
              <div className="mt-10">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-8 py-4 rounded-full bg-primary-purple/20 text-white font-bold border border-primary-purple glow-btn transition-all text-lg flex items-center gap-3 mx-auto hover:scale-105"
                >
                  <Wallet size={20} />
                  Se connecter
                </button>
              </div>
            </div>

            {/* Animated 3D Lanyard Card */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
              <Lanyard position={[0, -5, 20]} gravity={[0, -40, 0]} transparent={true} />
            </div>
            
            <div className="w-full h-[150px] absolute bottom-0 bg-gradient-to-t from-bg-dark to-transparent z-10 pointer-events-none" />
          </motion.div>
        )}

        {/* RIGHT PANEL: Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel flex-1 flex flex-col p-8 lg:p-12 min-h-[600px]"
        >
          <h2 className="text-3xl font-black text-white text-center uppercase tracking-widest mb-10 drop-shadow-md">
            Classement
          </h2>

          <RealtimeLeaderboard />
          
          <SipLeaderboard />
        </motion.div>

      </div>
    </main>
  );
}

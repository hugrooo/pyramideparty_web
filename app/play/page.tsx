"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { User, LogOut, Wallet, Trophy, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";
import Lanyard from "@/components/Lanyard";
import RealtimeLeaderboard from "@/components/RealtimeLeaderboard";
import PlayerDashboard from "@/components/PlayerDashboard";
import SipLeaderboard from "@/components/SipLeaderboard";

gsap.registerPlugin(useGSAP);

export default function Home() {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Background blobs animation
    gsap.to(".bg-blob-1", {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      scale: "random(0.8, 1.2)",
      duration: 10,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    gsap.to(".bg-blob-2", {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      scale: "random(0.8, 1.2)",
      duration: 12,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1,
    });

    // Intro animations
    const tl = gsap.timeline();
    
    tl.from(".nav-anim", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });

    tl.from(".hero-anim", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)",
    }, "-=0.4");
    
    tl.from(".panel-anim", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    }, "-=0.6");
    
  }, { scope: container });

  return (
    <main ref={container} className="min-h-screen bg-bg-dark flex flex-col relative overflow-hidden font-sans">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      {/* Dynamic Background Gradients */}
      <div className="bg-blob-1 absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-primary-purple/20 rounded-full blur-[150px] -z-10" />
      <div className="bg-blob-2 absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-cyan/15 rounded-full blur-[150px] -z-10" />
      
      {/* Navigation */}
      <nav className="w-full px-8 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3 nav-anim">
          <div className="w-10 h-10 relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
          <span className="text-xl font-black tracking-widest text-white uppercase hidden sm:block text-glow">Pyramide Party</span>
        </div>
        
        <div className="flex items-center gap-8 nav-anim">
          <div className="hidden md:flex items-center gap-6 font-semibold text-sm text-text-secondary uppercase tracking-wider">
            <a href="#" className="hover:text-white hover:text-shadow-glow transition-all">À propos</a>
            <a href="#" className="hover:text-white hover:text-shadow-glow transition-all">Documentation</a>
            <a href="#" className="hover:text-white hover:text-shadow-glow transition-all">Récompenses</a>
            <a href="https://www.tiktok.com/@pyramideparty" target="_blank" rel="noopener noreferrer" className="hover:text-primary-cyan hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
              </svg>
              TikTok
            </a>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-bg-card/50 rounded-full border border-primary-purple/30 glow-purple">
                <div className="w-6 h-6 rounded-full bg-primary-purple/20 flex items-center justify-center text-primary-purple">
                  <User size={14} />
                </div>
                <span className="text-white font-bold text-sm hidden sm:block">{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              <button onClick={logout} className="p-2 text-text-muted hover:text-primary-pink hover:drop-shadow-[0_0_8px_rgba(255,0,229,0.8)] transition-all">
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
          <div className="panel-anim flex-1 w-full flex">
            <PlayerDashboard user={user} />
          </div>
        ) : (
          <div className="glass-panel panel-anim flex-1 flex flex-col items-center pt-16 pb-0 px-8 relative min-h-[600px] w-full group">
            <div className="text-center z-20 max-w-md mt-10">
              <h1 className="hero-anim text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-2xl">
                Rejoins le <br/><span className="text-gradient-festive">Chaos</span>
              </h1>
              <p className="hero-anim text-text-secondary mt-6 text-lg">Connecte-toi pour découvrir la Pyramide, relever des gages et affronter tes amis !</p>
              <div className="mt-10 hero-anim">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-8 py-4 rounded-full bg-primary-purple/20 text-white font-bold border border-primary-purple glow-btn transition-all text-lg flex items-center gap-3 mx-auto hover:scale-105 active:scale-95"
                >
                  <Wallet size={20} />
                  Se connecter
                </button>
              </div>
            </div>

            {/* Animated 3D Lanyard Card */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-60 transition-opacity duration-500 group-hover:opacity-100">
              <Lanyard position={[0, -5, 20]} gravity={[0, -40, 0]} transparent={true} />
            </div>
            
            <div className="w-full h-[150px] absolute bottom-0 bg-gradient-to-t from-bg-dark to-transparent z-10 pointer-events-none" />
          </div>
        )}

        {/* RIGHT PANEL: Leaderboard */}
        <div className="glass-panel panel-anim flex-1 flex flex-col p-8 lg:p-12 min-h-[600px] w-full">
          <h2 className="text-3xl font-black text-white text-center uppercase tracking-widest mb-10 drop-shadow-md text-glow">
            Classement
          </h2>

          <RealtimeLeaderboard />
          
          <SipLeaderboard />
        </div>

      </div>
    </main>
  );
}

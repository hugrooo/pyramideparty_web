"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ref, onValue, set } from "firebase/database";
import { dbRT } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import useSound from "use-sound";
import Lanyard from "./Lanyard";
import DownloadModal from "./DownloadModal";
import { Users, Package, Trophy, Sparkles, Gift } from "lucide-react";

interface PlayerDashboardProps {
  user: FirebaseUser;
}

export default function PlayerDashboard({ user }: PlayerDashboardProps) {
  const [userData, setUserData] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  // Custom Texture State
  const [activeTexture, setActiveTexture] = useState<string | null>(null);

  const [playHover] = useSound('/sounds/whoosh.mp3', { volume: 0.25 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });

  useEffect(() => {
    // Fetch User Data
    const userRef = ref(dbRT, `users/${user.uid}`);
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setUserData(data);
      if (data?.activeBack) {
        setActiveTexture(data.activeBack);
      }
      setLoading(false);
    });

    // Fetch Friends
    const friendsRef = ref(dbRT, `friends/${user.uid}`);
    const unsubscribeFriends = onValue(friendsRef, async (snapshot) => {
      const friendsData = snapshot.val();
      if (friendsData) {
        const friendIds = Object.keys(friendsData);
        setFriends(friendIds.map(id => ({ id, name: "Ami " + id.substring(0,4) })));
      } else {
        setFriends([]);
      }
    });

    return () => {
      unsubscribeUser();
      unsubscribeFriends();
    };
  }, [user.uid]);

  useGSAP(() => {
    // Entrance animation
    gsap.from(".dash-element", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "all"
    });

    // Particles animation
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      gsap.to(particles, {
        y: () => `-=${Math.random() * 200 + 100}`,
        opacity: 0,
        duration: () => Math.random() * 5 + 5,
        ease: "linear",
        repeat: -1,
        stagger: {
          each: 0.2,
          from: "random"
        }
      });
    }
  }, { scope: container, dependencies: [loading] });

  // Add GSAP animation for inventory toggle
  useGSAP(() => {
    if (showInventory) {
      gsap.fromTo(".inventory-drawer", 
        { height: 0, opacity: 0 }, 
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, { scope: container, dependencies: [showInventory] });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[600px]">
        <div className="animate-pulse text-primary-cyan font-bold text-xl drop-shadow-[0_0_10px_#00F0FF]">
          Chargement du Hub...
        </div>
      </div>
    );
  }

  const level = userData?.level || 1;
  const xp = userData?.xp || 0;
  const xpNeeded = level * 100;
  const progress = Math.min((xp / xpNeeded) * 100, 100);
  const activeTitle = userData?.activeTitle || "Débutant";
  
  // Inventory counts
  const titlesCount = userData?.ownedTitles ? Object.keys(userData.ownedTitles).length : 0;
  const backsCount = userData?.ownedBacks ? Object.keys(userData.ownedBacks).length : 0;
  const totalItems = titlesCount + backsCount;

  // Daily Reward Logic
  const lastRewardTime = userData?.lastDailyReward || 0;
  const canClaimReward = Date.now() - lastRewardTime > 24 * 60 * 60 * 1000;

  const handleClaimReward = async () => {
    if (!canClaimReward || claiming) return;
    setClaiming(true);
    try {
      const userRef = ref(dbRT, `users/${user.uid}`);
      await set(userRef, {
        ...userData,
        xp: xp + 100,
        lastDailyReward: Date.now()
      });
      playSuccess();
    } catch (e) {
      console.error(e);
    }
    setClaiming(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedTexture = e.dataTransfer.getData("textureUrl");
    if (droppedTexture) {
      setActiveTexture(droppedTexture);
      playSuccess();
      try {
        const userRef = ref(dbRT, `users/${user.uid}`);
        await set(userRef, {
          ...userData,
          activeBack: droppedTexture
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      ref={container}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="glass-panel flex-1 flex flex-col pt-8 pb-8 px-8 relative min-h-[600px] overflow-hidden"
    >
      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-cyan"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * -20}%`,
              opacity: Math.random() * 0.5 + 0.2,
              transform: `scale(${Math.random() * 2})`,
              boxShadow: "0 0 10px 2px rgba(0, 240, 255, 0.6)",
            }}
          />
        ))}
      </div>

      {/* 3D Lanyard Background */}
      <div className="dash-element absolute inset-0 z-0 pointer-events-none opacity-40">
        <Lanyard position={[0, -5, 25]} gravity={[0, -20, 0]} transparent={true} cardTexture={activeTexture} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Profile */}
        <div className="dash-element flex items-center gap-6 mb-10">
          <div className="relative w-24 h-24 rounded-full bg-bg-dark border-2 border-primary-cyan shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center text-4xl">
            😎
            {/* XP Circular Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="50" cy="50" r="48" fill="none" stroke="#00F0FF" strokeWidth="4" strokeDasharray="301.59" strokeDashoffset={301.59 - (progress / 100) * 301.59} className="transition-all duration-1000 ease-out" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-white drop-shadow-md text-glow">
              {userData?.pseudo || user.displayName || "Joueur"}
            </h2>
            <div className="flex gap-3 mt-2">
              <span className="px-3 py-1 bg-primary-cyan/20 border border-primary-cyan rounded-full text-primary-cyan font-bold text-sm shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                Niv. {level}
              </span>
              <span className="px-3 py-1 bg-primary-purple/20 border border-primary-purple rounded-full text-primary-purple font-bold text-sm shadow-[0_0_10px_rgba(112,0,255,0.2)] flex items-center gap-1">
                <Sparkles size={14} />
                {activeTitle}
              </span>
            </div>
            <p className="text-text-secondary text-sm mt-2 font-medium">
              XP : {xp} / {xpNeeded}
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dash-element grid grid-cols-2 gap-6 flex-1">
          {/* Inventory Card */}
          <div 
            onMouseEnter={() => playHover()}
            onClick={() => {
              playClick();
              setShowInventory(!showInventory);
            }}
            className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6 hover:border-primary-cyan/50 transition-colors group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-cyan/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary-cyan/20 transition-colors" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-cyan/20 flex items-center justify-center text-primary-cyan">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Inventaire</h3>
            </div>
            <p className="text-text-secondary mb-4">Découvrez vos objets, dos de cartes et titres débloqués.</p>
            <div className="text-3xl font-black text-primary-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              {totalItems} <span className="text-sm font-bold text-text-muted">objets</span>
            </div>
          </div>

          {/* Friends Card */}
          <div 
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6 hover:border-primary-purple/50 transition-colors group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-purple/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary-purple/20 transition-colors" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-purple/20 flex items-center justify-center text-primary-purple">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Amis</h3>
            </div>
            <p className="text-text-secondary mb-4">Rejoignez vos amis connectés ou invitez-les à jouer.</p>
            <div className="text-3xl font-black text-primary-purple drop-shadow-[0_0_10px_rgba(112,0,255,0.5)]">
              {friends.length} <span className="text-sm font-bold text-text-muted">amis</span>
            </div>
          </div>
        </div>

        {/* Inventory Drawer (Shows on click) */}
        {showInventory && (
          <div className="inventory-drawer mt-6 p-4 rounded-xl bg-black/40 border border-white/10 overflow-hidden">
            <h4 className="text-white font-bold mb-3">Glissez-déposez un Dos de carte vers le fond 3D</h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {/* Mock items since we don't have real textures, we will just use colors or placeholder URLs */}
              {userData?.ownedBacks ? Object.keys(userData.ownedBacks).map((backId, i) => {
                const mockUrl = `/logo.png`; // On utilise l'image du logo comme mock de texture si pas de vraie URL
                return (
                  <div 
                    key={backId}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("textureUrl", mockUrl);
                    }}
                    className="w-20 h-28 rounded-lg bg-primary-cyan/20 border-2 border-primary-cyan flex-shrink-0 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform flex flex-col items-center justify-center"
                  >
                    <span className="text-xs font-bold text-primary-cyan uppercase mt-1">Dos #{i+1}</span>
                  </div>
                );
              }) : (
                // Si l'utilisateur n'a pas de dos de cartes, on affiche un mock par défaut avec le logo
                ["logo"].map((id) => (
                  <div 
                    key={id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("textureUrl", "/logo.png");
                    }}
                    className="w-20 h-28 rounded-lg bg-bg-card border-2 border-dashed border-white/20 flex-shrink-0 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform flex flex-col items-center justify-center text-center p-1 relative overflow-hidden"
                  >
                    <img src="/logo.png" alt="Logo" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    <span className="text-[10px] text-white font-bold z-10 bg-black/50 px-1 rounded">Glissez-moi !</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Daily Reward Banner */}
        {canClaimReward && (
          <div className="dash-element mt-6 bg-gradient-to-r from-primary-pink/20 to-primary-purple/20 border border-primary-pink/50 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(255,0,255,0.2)]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-pink/20 flex items-center justify-center text-primary-pink animate-bounce">
                <Gift size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold">Récompense Quotidienne</h4>
                <p className="text-text-secondary text-sm">Gagnez +100 XP gratuitement !</p>
              </div>
            </div>
            <button 
              onClick={handleClaimReward}
              disabled={claiming}
              className="px-6 py-2 rounded-full bg-primary-pink text-white font-black shadow-[0_0_10px_rgba(255,0,255,0.5)] hover:scale-105 transition-transform flex items-center gap-2"
            >
              {claiming ? "..." : "Réclamer"}
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="dash-element mt-8 flex justify-center">
          <a 
            onMouseEnter={() => playHover()}
            onClick={() => {
              playClick();
            }}
            href="/game/"
            className="px-12 py-4 rounded-full bg-gradient-to-r from-primary-cyan/30 to-primary-purple/30 text-white font-black border border-white/20 hover:border-white/50 shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all text-lg flex items-center gap-3 hover:scale-105 group relative overflow-hidden inline-block text-center"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            <Trophy size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">Lancer une Partie</span>
          </a>
        </div>
      </div>
      
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </div>
  );
}

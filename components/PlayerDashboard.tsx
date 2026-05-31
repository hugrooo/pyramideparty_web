"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
        // We only have the UIDs of the friends. We should fetch their names
        // But for simplicity, we'll just show the number of friends or placeholder names if we don't do a full join
        // In a real app, you'd fetch each friend's profile.
        const friendIds = Object.keys(friendsData);
        // For the dashboard, knowing the count is already great, but let's mock the names for the UI
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="glass-panel flex-1 flex flex-col pt-8 pb-8 px-8 relative min-h-[600px] overflow-hidden"
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-cyan"
            initial={{
              x: Math.random() * 1000 - 500,
              y: Math.random() * 600,
              opacity: Math.random() * 0.5 + 0.2,
              scale: Math.random() * 2,
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              boxShadow: "0 0 10px 2px rgba(0, 240, 255, 0.6)",
            }}
          />
        ))}
      </div>

      {/* 3D Lanyard Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Lanyard position={[0, -5, 25]} gravity={[0, -20, 0]} transparent={true} cardTexture={activeTexture} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Profile */}
        <div className="flex items-center gap-6 mb-10">
          <div className="relative w-24 h-24 rounded-full bg-bg-dark border-2 border-primary-cyan shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center text-4xl">
            😎
            {/* XP Circular Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="50" cy="50" r="48" fill="none" stroke="#00F0FF" strokeWidth="4" strokeDasharray="301.59" strokeDashoffset={301.59 - (progress / 100) * 301.59} className="transition-all duration-1000 ease-out" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-white drop-shadow-md">
              {userData?.pseudo || user.displayName || "Joueur"}
            </h2>
            <div className="flex gap-3 mt-2">
              <span className="px-3 py-1 bg-primary-cyan/20 border border-primary-cyan rounded-full text-primary-cyan font-bold text-sm shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                Niv. {level}
              </span>
              <span className="px-3 py-1 bg-primary-purple/20 border border-primary-purple rounded-full text-primary-purple font-bold text-sm shadow-[0_0_10px_rgba(188,19,254,0.2)] flex items-center gap-1">
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
        <div className="grid grid-cols-2 gap-6 flex-1">
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
            <div className="text-3xl font-black text-primary-purple drop-shadow-[0_0_10px_rgba(188,19,254,0.5)]">
              {friends.length} <span className="text-sm font-bold text-text-muted">amis</span>
            </div>
          </div>
        </div>

        {/* Inventory Drawer (Shows on click) */}
        {showInventory && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10 overflow-hidden"
          >
            <h4 className="text-white font-bold mb-3">Glissez-déposez un Dos de carte vers le fond 3D</h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {/* Mock items since we don't have real textures, we will just use colors or placeholder URLs */}
              {userData?.ownedBacks ? Object.keys(userData.ownedBacks).map((backId, i) => {
                // Pour l'exemple, on utilise une couleur aléatoire ou un motif (dans une vraie app, on aurait une URL)
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
                // Si l'utilisateur n'a pas de dos de cartes, on affiche 2 mocks par défaut pour l'exemple
                ["mock_1", "mock_2"].map((id, i) => (
                  <div 
                    key={id}
                    draggable
                    onDragStart={(e) => {
                      // Fake pattern base64 image just to see a texture change
                      const canvas = document.createElement('canvas');
                      canvas.width = 512; canvas.height = 512;
                      const ctx = canvas.getContext('2d');
                      if(ctx) {
                        ctx.fillStyle = i === 0 ? '#1a1a2e' : '#4a0e4e';
                        ctx.fillRect(0,0,512,512);
                        ctx.fillStyle = i === 0 ? '#00F0FF' : '#FF00FF';
                        ctx.font = '80px Arial';
                        ctx.fillText('CUSTOM', 80, 256);
                      }
                      e.dataTransfer.setData("textureUrl", canvas.toDataURL());
                    }}
                    className="w-20 h-28 rounded-lg bg-bg-card border-2 border-dashed border-white/20 flex-shrink-0 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform flex flex-col items-center justify-center text-center p-2"
                  >
                    <span className="text-[10px] text-text-muted">Glissez-moi !</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Daily Reward Banner */}
        {canClaimReward && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-r from-primary-pink/20 to-primary-purple/20 border border-primary-pink/50 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(255,0,255,0.2)]"
          >
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
          </motion.div>
        )}

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <button 
            onMouseEnter={() => playHover()}
            onClick={() => {
              playClick();
              setIsDownloadModalOpen(true);
            }}
            className="px-12 py-4 rounded-full bg-gradient-to-r from-primary-cyan/30 to-primary-purple/30 text-white font-black border border-white/20 hover:border-white/50 shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all text-lg flex items-center gap-3 hover:scale-105 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            <Trophy size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">Lancer une Partie</span>
          </button>
        </div>
      </div>
      
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </motion.div>
  );
}

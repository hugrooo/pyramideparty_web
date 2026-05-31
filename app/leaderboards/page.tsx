"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { dbRT } from "@/lib/firebase";
import { Trophy, Beer, Sparkles, Medal } from "lucide-react";
import useSound from "use-sound";

export default function LeaderboardsPage() {
  const [playHover] = useSound('/sounds/whoosh.mp3', { volume: 0.15 });
  const [activeTab, setActiveTab] = useState<"xp" | "sips">("xp");
  
  const [xpLeaders, setXpLeaders] = useState<any[]>([]);
  const [sipLeaders, setSipLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch XP Leaders (from /users)
    const xpRef = query(ref(dbRT, 'users'), orderByChild('xp'), limitToLast(50));
    const unsubXp = onValue(xpRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.keys(data).map(k => ({ id: k, ...data[k] })).sort((a,b) => (b.xp || 0) - (a.xp || 0));
        setXpLeaders(list);
      }
    });

    // Fetch Sip Leaders (from /leaderboard)
    const sipRef = query(ref(dbRT, 'leaderboard'), orderByChild('totalSips'), limitToLast(50));
    const unsubSip = onValue(sipRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.keys(data).map(k => ({ id: k, ...data[k] })).sort((a,b) => (b.totalSips || 0) - (a.totalSips || 0));
        setSipLeaders(list);
      }
      setLoading(false);
    });

    return () => { unsubXp(); unsubSip(); };
  }, []);

  const currentList = activeTab === "xp" ? xpLeaders : sipLeaders;
  const mainValueKey = activeTab === "xp" ? "xp" : "totalSips";

  return (
    <div className="flex flex-col min-h-screen p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-purple/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 relative z-10 gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 flex items-center gap-4 drop-shadow-lg">
            <Trophy className="text-primary-orange" size={48} />
            Hall of Fame
          </h1>
          <p className="text-text-secondary text-lg">Les légendes de Pyramide Party s'écrivent ici.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-black/50 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab("xp")}
            onMouseEnter={() => playHover()}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === "xp" ? "bg-primary-cyan text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]" : "text-white hover:bg-white/5"}`}
          >
            <Sparkles size={18} />
            Top Joueurs (XP)
          </button>
          <button 
            onClick={() => setActiveTab("sips")}
            onMouseEnter={() => playHover()}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === "sips" ? "bg-primary-orange text-black shadow-[0_0_15px_rgba(255,165,0,0.4)]" : "text-white hover:bg-white/5"}`}
          >
            <Beer size={18} />
            Top Buveurs
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="relative z-10 bg-bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/10 bg-black/20 text-xs font-bold text-text-muted uppercase tracking-wider">
          <div className="col-span-2 md:col-span-1 text-center">Rang</div>
          <div className="col-span-7 md:col-span-8">Joueur</div>
          <div className="col-span-3 text-right">Score</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-muted animate-pulse">Recherche des légendes...</div>
        ) : (
          <div className="flex flex-col">
            {currentList.map((player, index) => {
              const isTop3 = index < 3;
              let medalColor = "";
              if (index === 0) medalColor = "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]";
              else if (index === 1) medalColor = "text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.8)]";
              else if (index === 2) medalColor = "text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]";

              return (
                <motion.div 
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`grid grid-cols-12 gap-4 p-6 border-b border-white/5 items-center hover:bg-white/5 transition-colors ${index === 0 ? "bg-gradient-to-r from-yellow-400/10 to-transparent" : ""}`}
                >
                  <div className="col-span-2 md:col-span-1 flex justify-center">
                    {isTop3 ? (
                      <Medal size={28} className={medalColor} />
                    ) : (
                      <span className="text-xl font-black text-white/30">#{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="col-span-7 md:col-span-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white border border-white/20">
                      {(player.pseudo || player.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{player.pseudo || player.name || "Anonyme"}</div>
                      {player.activeTitle && (
                        <div className="text-xs text-primary-purple font-bold">{player.activeTitle}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3 text-right">
                    <div className={`text-2xl font-black ${activeTab === "xp" ? "text-primary-cyan" : "text-primary-orange"}`}>
                      {player[mainValueKey]}
                    </div>
                    <div className="text-xs text-text-muted font-bold uppercase">{activeTab === "xp" ? "XP" : "Gorgées"}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

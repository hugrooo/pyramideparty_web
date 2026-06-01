"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { dbRT } from "@/lib/firebase";

interface LeaderboardUser {
  id: string;
  name: string;
  level: number;
  activeTitle: string;
  xp: number;
}

export default function RealtimeLeaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dans Firebase RTDB, on orderByChild('xp') et limitToLast(100) pour avoir les meilleurs
    const leaderboardRef = query(ref(dbRT, 'users'), orderByChild('xp'), limitToLast(100));

    const unsubscribe = onValue(leaderboardRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList: LeaderboardUser[] = [];
        Object.keys(data).forEach((key) => {
          usersList.push({
            id: key,
            name: data[key].pseudo || data[key].name || "Joueur Inconnu",
            level: data[key].level || 1,
            activeTitle: data[key].activeTitle || "Débutant",
            xp: data[key].xp || 0,
          });
        });
        
        // Trier en ordre décroissant d'XP
        usersList.sort((a, b) => b.xp - a.xp);
        setUsers(usersList.slice(0, 3));
      } else {
        setUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useGSAP(() => {
    if (!loading && users.length > 0) {
      gsap.from(".leaderboard-item", {
        opacity: 0,
        x: -40,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.5)",
        clearProps: "all"
      });
    }
  }, { scope: container, dependencies: [loading, users] });

  return (
    <div className="w-full" ref={container}>
      {/* Headers */}
      <div className="grid grid-cols-4 gap-4 px-4 pb-4 border-b border-white/10 text-xs font-bold text-text-secondary uppercase tracking-wider">
        <div className="col-span-1">Rang</div>
        <div className="col-span-1">Joueur</div>
        <div className="col-span-1">Niveau</div>
        <div className="col-span-1 text-right">Titre</div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-8 text-center text-text-muted font-bold animate-pulse">
          Chargement du classement...
        </div>
      ) : users.length === 0 ? (
        <div className="py-8 text-center text-text-muted font-bold">
          Aucun joueur trouvé.
        </div>
      ) : (
        <ul className="flex flex-col gap-3 mt-4">
          {users.map((player, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            return (
              <li 
                key={player.id}
                className={`leaderboard-item relative overflow-hidden rounded-xl bg-bg-dark/40 border transition-all duration-300 hover:scale-[1.02] ${
                  isTop3 ? 'border-primary-cyan/30 bg-primary-cyan/5 hover:border-primary-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]' : 'border-white/5 hover:border-white/20'
                }`}
              >
                {isTop3 && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary-cyan shadow-[0_0_10px_#00F0FF]" />
                )}
                <div className="flex items-center px-4 py-4 grid grid-cols-4 gap-4">
                  <div className="col-span-1 font-black text-xl text-white flex items-center gap-2">
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : <span className="text-text-muted opacity-50 ml-1">#{rank}</span>}
                  </div>
                  <div className="col-span-1 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-purple/20 border border-primary-purple flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(112,0,255,0.3)]">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-white">{player.name}</span>
                  </div>
                  <div className="col-span-1 font-mono text-primary-cyan font-bold flex items-center">
                    Niv. {player.level}
                  </div>
                  <div className="col-span-1 text-right font-bold text-primary-purple bg-primary-purple/10 px-2 py-1 rounded-md self-center text-sm inline-block truncate">
                    {player.activeTitle}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

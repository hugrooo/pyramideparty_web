"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { dbRT } from "@/lib/firebase";
import { Shield, Trophy, Users, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Squad {
  id: string;
  name: string;
  tag: string;
  xp: number;
  memberCount: number;
}

export default function SquadsPage() {
  const { user } = useAuth();
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dans Firebase RTDB, on orderByChild('xp') et limitToLast(50) pour avoir les meilleures écoles
    const squadsRef = query(ref(dbRT, 'squads'), orderByChild('xp'), limitToLast(50));

    const unsubscribe = onValue(squadsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Squad[] = [];
        Object.keys(data).forEach((key) => {
          list.push({
            id: key,
            name: data[key].name || "École Inconnue",
            tag: data[key].tag || "UNK",
            xp: data[key].xp || 0,
            memberCount: data[key].memberCount || 0,
          });
        });
        
        // Trier en ordre décroissant d'XP
        list.sort((a, b) => b.xp - a.xp);
        setSquads(list);
      } else {
        setSquads([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useGSAP(() => {
    gsap.from(".header-anim", {
      y: -30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    });

    if (!loading && squads.length > 0) {
      gsap.from(".squad-item", {
        opacity: 0,
        x: -40,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.5)",
        clearProps: "all"
      });
    }
  }, { scope: container, dependencies: [loading, squads] });

  return (
    <div ref={container} className="min-h-screen bg-bg-dark text-white p-8 md:p-12 pb-32 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-primary-pink/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-primary-cyan/10 rounded-full blur-[150px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 header-anim">
          <div className="w-20 h-20 bg-primary-pink/20 rounded-3xl flex items-center justify-center text-primary-pink border border-primary-pink/30 shadow-[0_0_30px_rgba(255,0,229,0.2)] mb-6">
            <Shield size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-glow mb-4">
            Guerre des <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-pink to-primary-purple">Écoles</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl font-medium">
            Rejoins la Squad de ton BDE et cumule des points en jouant pour hisser ton école au sommet du classement national !
          </p>
        </div>

        {/* Classement */}
        <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-md shadow-2xl header-anim min-h-[400px]">
          
          <div className="grid grid-cols-12 gap-4 px-6 pb-6 border-b border-white/10 text-sm font-bold text-text-secondary uppercase tracking-wider">
            <div className="col-span-2 md:col-span-1">Rang</div>
            <div className="col-span-6 md:col-span-5">Escouade (École)</div>
            <div className="col-span-4 md:col-span-3 text-right md:text-left flex items-center justify-end md:justify-start gap-2">
              <Users size={16} /> <span className="hidden md:inline">Membres</span>
            </div>
            <div className="hidden md:flex col-span-3 text-right items-center justify-end gap-2 text-primary-pink">
              <Trophy size={16} /> Total XP
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-text-muted animate-pulse">
              <Shield size={48} className="mb-4 opacity-50" />
              <p className="text-xl font-bold uppercase tracking-widest">Recherche des Squads...</p>
            </div>
          ) : squads.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-text-muted">
              <Star size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-bold">Aucune école n'a encore rejoint la bataille.</p>
              <a href="/bde" className="mt-4 text-primary-cyan font-bold hover:underline">Devenir le premier BDE partenaire</a>
            </div>
          ) : (
            <ul className="flex flex-col gap-4 mt-6">
              {squads.map((squad, index) => {
                const rank = index + 1;
                const isTop1 = rank === 1;
                const isTop3 = rank <= 3;
                
                return (
                  <li 
                    key={squad.id}
                    className={`squad-item relative overflow-hidden rounded-2xl bg-bg-dark/50 border transition-all duration-300 hover:scale-[1.01] ${
                      isTop1 ? 'border-primary-pink/40 bg-primary-pink/10 shadow-[0_0_20px_rgba(255,0,229,0.15)]' 
                      : isTop3 ? 'border-primary-purple/30 bg-primary-purple/5' 
                      : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    {isTop1 && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-pink shadow-[0_0_15px_#FF00E5]" />
                    )}
                    <div className="grid grid-cols-12 gap-4 items-center px-6 py-5">
                      {/* Rang */}
                      <div className="col-span-2 md:col-span-1 font-black text-2xl text-white">
                        {rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : <span className="text-text-muted opacity-50">#{rank}</span>}
                      </div>
                      
                      {/* Nom / Tag */}
                      <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                        <div className={`hidden sm:flex w-12 h-12 rounded-xl border items-center justify-center font-black text-sm tracking-wider ${
                          isTop1 ? 'bg-primary-pink/20 border-primary-pink/50 text-primary-pink' : 'bg-white/5 border-white/10 text-text-muted'
                        }`}>
                          {squad.tag}
                        </div>
                        <div>
                          <div className={`font-black text-lg ${isTop1 ? 'text-white text-glow' : 'text-white'}`}>
                            {squad.name}
                          </div>
                          <div className="text-sm font-bold text-text-muted sm:hidden">
                            [{squad.tag}]
                          </div>
                        </div>
                      </div>

                      {/* Membres */}
                      <div className="col-span-4 md:col-span-3 text-right md:text-left font-bold text-text-secondary">
                        {squad.memberCount} <span className="text-sm font-normal text-text-muted">étudiants</span>
                      </div>

                      {/* XP (Desktop) */}
                      <div className="hidden md:flex col-span-3 text-right flex-col items-end">
                        <div className="font-black text-xl text-primary-pink drop-shadow-[0_0_8px_rgba(255,0,229,0.3)]">
                          {squad.xp.toLocaleString()} XP
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

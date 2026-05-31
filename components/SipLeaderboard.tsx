"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { dbRT } from "@/lib/firebase";
import { Beer } from "lucide-react";

interface SipUser {
  id: string;
  name: string;
  totalSips: number;
}

export default function SipLeaderboard() {
  const [users, setUsers] = useState<SipUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Les stats de gorgées sont dans /leaderboard triées par totalSips
    const sipRef = query(ref(dbRT, 'leaderboard'), orderByChild('totalSips'), limitToLast(5));

    const unsubscribe = onValue(sipRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList: SipUser[] = [];
        Object.keys(data).forEach((key) => {
          usersList.push({
            id: key,
            name: data[key].name || "Joueur Inconnu",
            totalSips: data[key].totalSips || 0,
          });
        });
        
        // Trier en ordre décroissant de gorgées
        usersList.sort((a, b) => b.totalSips - a.totalSips);
        setUsers(usersList);
      } else {
        setUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-4 text-text-muted animate-pulse">Chargement des légendes...</div>;
  if (users.length === 0) return null; // Ne rien afficher s'il n'y a pas de données

  return (
    <div className="w-full bg-bg-dark/40 border border-primary-orange/20 rounded-2xl p-6 mt-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-orange/10 rounded-full blur-2xl -mr-10 -mt-10" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-black text-white flex items-center gap-3 drop-shadow-md">
          <Beer className="text-primary-orange" />
          Légendes de la Soirée
        </h3>
        <span className="text-xs font-bold text-primary-orange uppercase tracking-wider bg-primary-orange/10 px-2 py-1 rounded-md">
          Top Buveurs
        </span>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        {users.map((player, index) => (
          <motion.div 
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-primary-orange/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="font-black text-lg text-white/50 w-6 text-center">
                #{index + 1}
              </div>
              <div className="font-bold text-white">
                {player.name}
              </div>
            </div>
            <div className="font-black text-primary-orange flex items-center gap-1 drop-shadow-[0_0_5px_rgba(255,165,0,0.5)]">
              {player.totalSips} <span className="text-sm">🍺</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

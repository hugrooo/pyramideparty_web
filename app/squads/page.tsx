"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Plus, Users, Search } from "lucide-react";
import { ref, onValue, push, set } from "firebase/database";
import { dbRT } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function SquadsPage() {
  const { user } = useAuth();
  const [squadsList, setSquadsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const squadsRef = ref(dbRT, 'squads');
    const unsub = onValue(squadsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        // Tri par nombre de membres par exemple, ou juste id
        list.sort((a,b) => (b.membersCount || 0) - (a.membersCount || 0));
        setSquadsList(list);
      } else {
        setSquadsList([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreateSquad = async () => {
    if (!user || creating) return;
    const name = prompt("Nom de votre Squad :");
    const tag = prompt("Tag (3-4 lettres) :");
    if (!name || !tag) return;

    setCreating(true);
    try {
      const newSquadRef = push(ref(dbRT, 'squads'));
      await set(newSquadRef, {
        name,
        tag: tag.toUpperCase().substring(0, 4),
        membersCount: 1,
        owner: user.uid,
        createdAt: Date.now()
      });
    } catch (e) {
      console.error(e);
    }
    setCreating(false);
  };

  const filteredSquads = squadsList.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.tag?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen p-8 relative">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-pink/10 flex items-center justify-center border border-primary-pink/20">
            <Shield size={32} className="text-primary-pink" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">Squads</h1>
            <p className="text-text-secondary">Rejoignez un clan ou créez le vôtre.</p>
          </div>
        </div>
        
        <button 
          onClick={handleCreateSquad}
          disabled={creating}
          className="flex items-center gap-2 bg-primary-pink text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          {creating ? "Création..." : "Créer un Squad"}
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un squad par nom ou tag..." 
            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary-pink/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center text-text-muted py-12 animate-pulse">Recherche des clans...</div>
        ) : filteredSquads.length === 0 ? (
          <div className="col-span-3 text-center text-text-muted py-12">Aucun Squad trouvé. Soyez le premier à en créer un !</div>
        ) : (
          filteredSquads.map((squad, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg-card border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-primary-pink/30 transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-pink/5 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-primary-pink/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-bold text-text-muted">
                [{squad.tag || "???"}]
              </div>
              <div className="text-primary-pink font-black flex items-center gap-1">
                #{i + 1}
              </div>
            </div>

            <h3 className="text-2xl font-black text-white mb-2 relative z-10">{squad.name}</h3>
            
            <div className="flex items-center gap-2 text-text-secondary mb-6 relative z-10">
              <Users size={16} />
              <span>{squad.membersCount || 1} membres</span>
            </div>

            <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors relative z-10">
              Rejoindre
            </button>
          </motion.div>
        )))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, ChevronRight } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { dbRT } from "@/lib/firebase";

export default function NewsPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newsRef = ref(dbRT, 'news');
    const unsub = onValue(newsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert to array and sort by date descending (assuming id or timestamp is sortable)
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse();
        setNewsList(list);
      } else {
        setNewsList([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-8 relative">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
          <Newspaper size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white">Actualités</h1>
          <p className="text-text-secondary">Les dernières news de la Taverne.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 text-center text-text-muted animate-pulse py-12">Recherche d'actualités...</div>
        ) : newsList.length === 0 ? (
          <div className="col-span-3 text-center text-text-muted py-12">Aucune actualité disponible pour le moment.</div>
        ) : (
          newsList.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-bg-card border border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-white/30 transition-colors"
          >
            <div className={`h-48 w-full ${item.image} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                {item.tag}
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-sm font-bold text-text-muted mb-2">{item.date}</div>
              <h3 className="text-2xl font-black text-white mb-3 line-clamp-2">{item.title}</h3>
              <p className="text-text-secondary line-clamp-3 mb-6">{item.excerpt}</p>
              
              <div className="flex items-center gap-2 text-primary-cyan font-bold group-hover:translate-x-2 transition-transform">
                Lire la suite <ChevronRight size={16} />
              </div>
            </div>
          </motion.div>
        )))}
      </div>
    </div>
  );
}

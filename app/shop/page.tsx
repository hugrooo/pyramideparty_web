"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Sparkles, Lock, Shield, X, CheckCircle, AlertTriangle } from "lucide-react";
import { ref, onValue, set } from "firebase/database";
import { dbRT } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import useSound from "use-sound";
import Card3D from "@/components/Card3D";

export default function ShopPage() {
  const { user } = useAuth();
  const [playHover] = useSound('/sounds/whoosh.mp3', { volume: 0.15 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.3 });
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });
  
  const [items, setItems] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  
  // New States for Categories and Modal
  const [activeTab, setActiveTab] = useState<"jokers" | "cardBacks">("jokers");
  const [alertState, setAlertState] = useState<{ title: string; message: string; type: "success" | "error" } | null>(null);

  const defaultShop = {
    // Dos de cartes (Diamonds)
    neon: { name: "Dos Néon Cyberpunk", desc: "Cyan et violet futuriste", type: "cardBack", price: 50, currency: "diamonds", color: "from-primary-cyan to-primary-purple" },
    pirate: { name: "Dos Pirate Doré", desc: "Légendes de la flibuste", type: "cardBack", price: 100, currency: "diamonds", color: "from-yellow-400 to-yellow-600" },
    retro: { name: "Dos Rétro Pixel", desc: "Ère 8-bit", type: "cardBack", price: 75, currency: "diamonds", color: "from-primary-pink to-pink-700" },
    girl: { name: "Dos Girly Rose", desc: "Rose éclatant", type: "cardBack", price: 50, currency: "diamonds", color: "from-pink-400 to-pink-500" },
    beta: { name: "Dos Testeur Bêta", desc: "Pionniers", type: "cardBack", price: 0, currency: "diamonds", color: "from-purple-500 to-purple-700" },
    pharaoh: { name: "Dos Pharaon", desc: "Ancienne Égypte", type: "cardBack", price: 150, currency: "diamonds", color: "from-yellow-600 to-yellow-800" },
    
    // Jokers (Coins)
    miroir: { name: "Joker Miroir", desc: "Renvoie les pénalités", type: "joker", price: 150, currency: "coins", color: "from-primary-cyan to-blue-500" },
    bouclier: { name: "Joker Bouclier", desc: "Réduit les pénalités", type: "joker", price: 100, currency: "coins", color: "from-primary-orange to-orange-600" },
    detecteur: { name: "Joker Détecteur", desc: "Probabilité de bluff", type: "joker", price: 200, currency: "coins", color: "from-primary-pink to-red-500" },
    double_dose: { name: "Joker Double Dose", desc: "Double pénalités", type: "joker", price: 120, currency: "coins", color: "from-primary-purple to-purple-700" }
  };

  // Initialisation avec les VRAIS skins de l'app si Firebase est vide
  const seedFirebaseShop = async () => {
    try {
      await set(ref(dbRT, 'shopItems'), defaultShop);
    } catch (e) {
      console.warn("Could not seed Firebase Shop (likely permission denied). Using local fallback.");
    }
  };

  useEffect(() => {
    const shopRef = ref(dbRT, 'shopItems');
    const unsubShop = onValue(shopRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setItems(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      } else {
        // Fallback local + tentative de peuplement
        setItems(Object.keys(defaultShop).map(key => ({ id: key, ...(defaultShop as any)[key] })));
        seedFirebaseShop();
      }
      setLoading(false);
    });

    if (user) {
      const userRef = ref(dbRT, `users/${user.uid}`);
      const unsubUser = onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
      });
      return () => { unsubShop(); unsubUser(); };
    }
    return () => unsubShop();
  }, [user]);

  const handleBuy = async (item: any) => {
    if (!user || !userData || buying) return;
    
    const balance = item.currency === "diamonds" ? (userData.diamonds || 0) : (userData.coins || 0);
    
    if (balance < item.price) {
      setAlertState({
        title: "Fonds Insuffisants",
        message: `Vous n'avez pas assez de ${item.currency === "diamonds" ? "Diamants" : "Pièces"} pour acheter ça !`,
        type: "error"
      });
      return;
    }

    setBuying(item.id);
    try {
      const userRef = ref(dbRT, `users/${user.uid}`);
      const updates = { ...userData };
      
      // Deduct currency
      if (item.currency === "diamonds") {
        updates.diamonds = balance - item.price;
      } else {
        updates.coins = balance - item.price;
      }
      
      // Add item correctly formatted for Flutter
      if (item.type === "cardBack") {
        const currentBacks = Array.isArray(userData.cardBacks) ? userData.cardBacks : Object.values(userData.cardBacks || {});
        if (!currentBacks.includes(item.id)) {
          updates.cardBacks = [...currentBacks, item.id];
        }
      } else if (item.type === "joker") {
        const currentJokers = userData.jokers || {};
        updates.jokers = { ...currentJokers, [item.id]: (currentJokers[item.id] || 0) + 1 };
      }

      await set(userRef, updates);
      playSuccess();
      setAlertState({
        title: "Achat Réussi !",
        message: `Vous venez d'obtenir : ${item.name}`,
        type: "success"
      });
    } catch (e) {
      console.error(e);
      setAlertState({
        title: "Erreur",
        message: "Une erreur est survenue lors de l'achat.",
        type: "error"
      });
    }
    setBuying(null);
  };

  // Filter items by category
  const filteredItems = items.filter(item => {
    if (activeTab === "jokers") return item.type === "joker";
    if (activeTab === "cardBacks") return item.type === "cardBack";
    return false;
  });

  return (
    <div className="flex flex-col min-h-screen p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 relative z-10 gap-4 flex-wrap">
        <div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-white mb-2">
            La Boutique
          </h1>
          <p className="text-text-secondary text-lg">100% synchronisée avec l'app mobile.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-bg-card border border-white/10 px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <span className="text-yellow-400">🪙</span>
            <span className="text-2xl font-black text-white">{userData?.coins || 0}</span>
          </div>
          <div className="flex items-center gap-2 bg-bg-card border border-white/10 px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <span className="text-cyan-400">💎</span>
            <span className="text-2xl font-black text-white">{userData?.diamonds || 0}</span>
          </div>
        </div>
      </div>

      {/* Categories / Tabs */}
      <div className="flex justify-center mb-10 relative z-10">
        <div className="flex bg-black/50 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab("jokers")}
            onMouseEnter={() => playHover()}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === "jokers" ? "bg-primary-cyan text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]" : "text-white hover:bg-white/5"}`}
          >
            <Shield size={18} />
            Jokers
          </button>
          <button 
            onClick={() => setActiveTab("cardBacks")}
            onMouseEnter={() => playHover()}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === "cardBacks" ? "bg-primary-pink text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]" : "text-white hover:bg-white/5"}`}
          >
            <Star size={18} />
            Cosmétiques
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 relative z-10">
        {loading ? (
          <div className="col-span-4 text-center text-text-muted py-12 animate-pulse">Ouverture de la boutique...</div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-4 text-center text-text-muted py-12">La boutique est vide pour le moment.</div>
        ) : (
          filteredItems.map((item, index) => {
            let isOwned = false;
            let ownedCount = 0;

            if (item.type === "cardBack") {
              const backs = Array.isArray(userData?.cardBacks) ? userData?.cardBacks : Object.values(userData?.cardBacks || {});
              isOwned = backs.includes(item.id);
            } else if (item.type === "joker") {
              ownedCount = userData?.jokers?.[item.id] || 0;
            }
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => playHover()}
                className="group relative bg-bg-card border border-white/10 rounded-3xl p-1 overflow-hidden cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color || "from-gray-600 to-gray-800"} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="bg-bg-dark rounded-[22px] h-full p-6 flex flex-col relative z-10 border border-transparent group-hover:border-white/10 transition-colors">
                  
                  {/* Owned Count Badge for Jokers */}
                  {item.type === "joker" && ownedCount > 0 && (
                    <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-md bg-white/10 border border-white/20 text-white">
                      Possédé: x{ownedCount}
                    </div>
                  )}

                  <div className={`w-full h-40 rounded-xl bg-gradient-to-br ${item.type === 'joker' ? item.color : "from-transparent to-transparent"} mb-6 flex items-center justify-center shadow-inner relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    {item.type === "cardBack" ? (
                      <div className="absolute inset-0 scale-[1.3] pt-4">
                        <Card3D textureId={item.id} />
                      </div>
                    ) : isOwned ? (
                      <Lock size={48} className="text-white drop-shadow-lg opacity-50 mix-blend-overlay" />
                    ) : item.type === "joker" ? (
                      <Shield size={48} className="text-white drop-shadow-lg opacity-50 mix-blend-overlay" />
                    ) : (
                      <Star size={48} className="text-white drop-shadow-lg opacity-50 mix-blend-overlay" />
                    )}
                  </div>

                  <div className="mb-1 text-sm font-bold text-primary-cyan uppercase tracking-wider">
                    {item.type === "cardBack" ? "Dos de Carte" : "Joker"}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 leading-tight">{item.name}</h3>
                  <p className="text-xs text-text-secondary mb-6">{item.desc}</p>
                  
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xl font-black text-white flex items-center gap-1">
                      {item.price} <span className="text-sm">{item.currency === "diamonds" ? "💎" : "🪙"}</span>
                    </span>
                    <button 
                      onClick={() => { playClick(); handleBuy(item); }}
                      disabled={isOwned || buying === item.id}
                      className={`${isOwned ? "bg-white/5 text-text-muted" : "bg-white/10 hover:bg-primary-cyan text-white"} p-3 rounded-xl transition-colors`}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Custom Popup Modal */}
      <AnimatePresence>
        {alertState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-bg-dark border border-white/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setAlertState(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${alertState.type === 'success' ? 'bg-primary-cyan/20 text-primary-cyan' : 'bg-red-500/20 text-red-500'}`}>
                  {alertState.type === 'success' ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2">{alertState.title}</h3>
                <p className="text-text-secondary mb-8">{alertState.message}</p>
                
                <button
                  onClick={() => { playClick(); setAlertState(null); }}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-transform hover:scale-105 ${alertState.type === 'success' ? 'bg-primary-cyan text-black' : 'bg-red-500'}`}
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

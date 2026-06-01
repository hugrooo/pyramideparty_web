"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { ref, get, update, runTransaction } from "firebase/database";
import { dbRT } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromoCodeModal({ isOpen, onClose }: PromoCodeModalProps) {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [rewardDetails, setRewardDetails] = useState<any>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setCode("");
    setError("");
    setSuccess(false);
    setRewardDetails(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const codeUpper = code.trim().toUpperCase();
      const codeRef = ref(dbRT, `promo_codes/${codeUpper}`);
      const snapshot = await get(codeRef);

      if (!snapshot.exists()) {
        setError("Ce code est invalide ou n'existe pas.");
        setLoading(false);
        return;
      }

      const codeData = snapshot.val();
      
      // Check if user already used this code type (simplified: we just check if they are already in this squad)
      const userRef = ref(dbRT, `users/${user.uid}`);
      const userSnap = await get(userRef);
      const userData = userSnap.val();

      if (userData?.squadId === codeData.squadId) {
        setError("Vous faites déjà partie de cette Squad !");
        setLoading(false);
        return;
      }

      // 1. Appliquer les récompenses au joueur
      const updates: any = {
        squadId: codeData.squadId,
        coins: (userData?.coins || 0) + (codeData.coinsReward || 500)
      };

      if (codeData.titleReward) {
        updates.activeTitle = codeData.titleReward;
        updates[`unlockedTitles/${codeData.titleReward}`] = true;
      }

      await update(userRef, updates);

      // 2. Incrémenter le nombre de membres de la Squad
      const squadRef = ref(dbRT, `squads/${codeData.squadId}/memberCount`);
      await runTransaction(squadRef, (currentCount) => {
        return (currentCount || 0) + 1;
      });

      setRewardDetails({
        squadName: codeData.squadName,
        coins: codeData.coinsReward || 500,
        title: codeData.titleReward
      });
      setSuccess(true);
      
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'activation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-bg-card border border-primary-orange/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(255,184,0,0.15)] overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary-orange/20 blur-[50px] -z-10" />

          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {success ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.3)] border border-green-500/30">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 text-glow">
                Bienvenue dans la Squad !
              </h2>
              <p className="text-text-secondary font-medium mb-6">
                Tu as rejoint <strong className="text-primary-pink">{rewardDetails?.squadName}</strong>.
              </p>
              
              <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Bonus de bienvenue :</span>
                  <span className="text-yellow-400 font-bold">+{rewardDetails?.coins} Pièces</span>
                </div>
                {rewardDetails?.title && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Titre exclusif :</span>
                    <span className="text-primary-cyan font-bold flex items-center gap-1">
                      <Sparkles size={14} /> {rewardDetails?.title}
                    </span>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleClose}
                className="mt-8 w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-orange/20 text-primary-orange flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,184,0,0.3)]">
                  <Gift size={32} />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">
                  Code Partenaire
                </h2>
                <p className="text-text-secondary font-medium text-sm">
                  Entre le code de ton BDE ou de ton école pour rejoindre ta Squad et débloquer tes bonus.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Ex: BDE-HEC-2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-center text-white placeholder:text-text-muted focus:outline-none focus:border-primary-orange focus:shadow-[0_0_15px_rgba(255,184,0,0.2)] transition-all font-black tracking-widest uppercase text-xl"
                  required
                />

                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="w-full bg-gradient-to-r from-primary-orange to-primary-pink text-white font-black py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,184,0,0.3)]"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Activer mon Code"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

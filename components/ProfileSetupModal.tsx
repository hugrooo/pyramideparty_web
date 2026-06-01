"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, AlertCircle } from "lucide-react";
import { ref, get, query, orderByChild, equalTo, update } from "firebase/database";
import { dbRT } from "@/lib/firebase";

interface ProfileSetupModalProps {
  uid: string;
  onComplete: () => void;
}

export default function ProfileSetupModal({ uid, onComplete }: ProfileSetupModalProps) {
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim() || pseudo.length < 3) {
      setError("Le pseudo doit contenir au moins 3 caractères.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const searchName = pseudo.trim().toLowerCase();

      // Check if pseudo already exists
      const usersRef = ref(dbRT, "users");
      const pseudoQuery = query(usersRef, orderByChild("searchName"), equalTo(searchName));
      const snapshot = await get(pseudoQuery);

      if (snapshot.exists()) {
        setError("Ce pseudo est déjà pris. Veuillez en choisir un autre.");
        setLoading(false);
        return;
      }

      // Save pseudo and initialize user profile
      const userRef = ref(dbRT, `users/${uid}`);
      await update(userRef, {
        pseudo: pseudo.trim(),
        searchName: searchName,
        level: 1,
        xp: 0,
        activeTitle: "Débutant",
      });

      onComplete();
    } catch (err: any) {
      console.error(err);
      setError("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Backdrop (solid, no click to close since it's blocking) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-bg-dark/95 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md bg-black/60 border border-primary-cyan/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary-cyan/20 blur-[60px] -z-10 pointer-events-none" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 mb-6 relative rounded-full bg-primary-cyan/10 border-2 border-primary-cyan flex items-center justify-center text-primary-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <User size={40} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 text-glow">
              Qui es-tu ?
            </h2>
            <p className="text-text-secondary font-medium">
              Choisis ton pseudo unique pour rejoindre la Pyramide Party.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold flex items-center gap-3"
            >
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="text"
                placeholder="Ton pseudo épique..."
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                maxLength={20}
                className="w-full bg-bg-dark/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-text-muted focus:outline-none focus:border-primary-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all font-bold text-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !pseudo.trim()}
              className="w-full bg-gradient-to-r from-primary-cyan to-primary-purple text-white font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              {loading ? (
                "Vérification..."
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Valider mon profil
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Check, AlertCircle, X } from "lucide-react";
import { ref, get, query, orderByChild, equalTo, update } from "firebase/database";
import { dbRT } from "@/lib/firebase";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
  currentPseudo: string;
}

export default function EditProfileModal({ isOpen, onClose, uid, currentPseudo }: EditProfileModalProps) {
  const [pseudo, setPseudo] = useState(currentPseudo || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim() || pseudo.length < 3) {
      setError("Le pseudo doit contenir au moins 3 caractères.");
      return;
    }

    if (pseudo.trim() === currentPseudo) {
      onClose(); // No changes
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
        // Since we are editing, check if the found pseudo belongs to us
        const data = snapshot.val();
        const otherIds = Object.keys(data).filter(key => key !== uid);
        
        if (otherIds.length > 0) {
          setError("Ce pseudo est déjà pris. Veuillez en choisir un autre.");
          setLoading(false);
          return;
        }
      }

      // Update pseudo
      const userRef = ref(dbRT, `users/${uid}`);
      await update(userRef, {
        pseudo: pseudo.trim(),
        searchName: searchName,
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      setError("Une erreur est survenue lors de l'enregistrement.");
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-bg-card border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary-purple/20 blur-[60px] -z-10" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-2">
              Modifier le Profil
            </h2>
            <p className="text-text-secondary font-medium">
              Change ton pseudo pour la Pyramide Party.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="text"
                placeholder="Nouveau pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                maxLength={20}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-text-muted focus:outline-none focus:border-primary-purple transition-colors font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !pseudo.trim()}
              className="w-full bg-primary-purple text-white font-black py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(188,19,254,0.4)]"
            >
              {loading ? "Vérification..." : <><Check size={20} /> Sauvegarder</>}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

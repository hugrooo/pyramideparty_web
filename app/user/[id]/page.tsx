"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { dbRT } from "@/lib/firebase";
import { Trophy, Shield, Sparkles, AlertTriangle, Edit3 } from "lucide-react";
import Lanyard from "@/components/Lanyard";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import EditProfileModal from "@/components/EditProfileModal";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { user } = useAuth();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const userRef = ref(dbRT, `users/${userId}`);
    const unsub = onValue(userRef, (snap) => {
      setUserData(snap.val());
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center animate-pulse text-primary-cyan text-xl">Chargement du profil...</div>;
  }

  if (!userData && userId !== user?.uid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle size={64} className="text-primary-pink mb-6" />
        <h1 className="text-4xl font-black text-white mb-2">Joueur Introuvable</h1>
        <p className="text-text-secondary">Ce profil n'existe pas ou a été supprimé.</p>
      </div>
    );
  }

  const level = userData?.level || 1;
  const xp = userData?.xp || 0;
  const title = userData?.activeTitle || "Débutant";
  const activeTexture = userData?.activeBack || null;
  
  // If it's the current user, fallback to Google Display Name if no pseudo
  const isCurrentUser = userId === user?.uid;
  const displayName = userData?.pseudo || (isCurrentUser ? user?.displayName : null) || "Anonyme";

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* 3D Background specifically for this player's lanyard */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <Lanyard position={[0, 0, 35]} gravity={[0, -10, 0]} transparent={true} cardTexture={activeTexture} />
      </div>

      <div className="relative z-10 flex flex-col items-center p-8 pt-20">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-bg-dark border-4 border-primary-cyan flex items-center justify-center text-5xl mb-6 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
            😎
          </div>
          {isCurrentUser && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-6 right-0 w-10 h-10 bg-primary-purple rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform border-2 border-bg-dark"
              title="Modifier le profil"
            >
              <Edit3 size={18} />
            </button>
          )}
        </div>

        {/* Info */}
        <h1 className="text-5xl font-black text-white mb-3 drop-shadow-md">
          {displayName}
        </h1>
        
        <div className="flex gap-4 mb-12">
          <span className="px-4 py-2 bg-primary-cyan/20 border border-primary-cyan rounded-full text-primary-cyan font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            Niv. {level}
          </span>
          <span className="px-4 py-2 bg-primary-purple/20 border border-primary-purple rounded-full text-primary-purple font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(188,19,254,0.2)]">
            <Sparkles size={16} />
            {title}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-6 hover:border-primary-cyan/30 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400/20 flex items-center justify-center text-yellow-400">
              <Trophy size={32} />
            </div>
            <div>
              <div className="text-text-secondary text-sm font-bold uppercase tracking-wider mb-1">Expérience Totale</div>
              <div className="text-3xl font-black text-white">{xp} <span className="text-sm text-text-muted">XP</span></div>
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-6 hover:border-primary-orange/30 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-primary-orange/20 flex items-center justify-center text-primary-orange">
              <Shield size={32} />
            </div>
            <div>
              <div className="text-text-secondary text-sm font-bold uppercase tracking-wider mb-1">Statut du Compte</div>
              <div className="text-3xl font-black text-white">Actif</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isCurrentUser && (
        <EditProfileModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          uid={user.uid}
          currentPseudo={userData?.pseudo || ""}
        />
      )}
    </div>
  );
}

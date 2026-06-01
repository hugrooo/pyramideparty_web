"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Rocket, Star, Users, Zap, CheckCircle, Mail } from "lucide-react";

export default function BDEPartnershipPage() {
  const container = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({ name: "", school: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  useGSAP(() => {
    // Entrée des éléments
    gsap.from(".bde-anim", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "back.out(1.5)",
    });

    gsap.to(".glow-pulse", {
      scale: 1.05,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: container });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div ref={container} className="min-h-screen bg-bg-dark text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-primary-orange/20 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-cyan/15 rounded-full blur-[150px] -z-10 glow-pulse" />

      <div className="max-w-4xl w-full text-center mt-12 mb-16 bde-anim">
        <div className="inline-block px-4 py-1 rounded-full bg-primary-orange/20 text-primary-orange font-bold text-sm mb-6 border border-primary-orange/30">
          PARTENARIATS ÉTUDIANTS
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-glow mb-6">
          Enflammez vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-orange to-primary-pink">WEI</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium">
          Associez votre BDE à Pyramide Party et offrez une expérience inoubliable à vos étudiants avec des avantages exclusifs en jeu.
        </p>
      </div>

      {/* Avantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-20">
        <div className="bde-anim bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-primary-cyan/40 transition-colors backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-primary-cyan/20 text-primary-cyan flex items-center justify-center mb-6">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Codes Promos BDE</h3>
          <p className="text-text-muted">Obtenez un code exclusif (ex: BDE-HEC) qui offre des pièces bonus et un titre spécial à tous vos étudiants.</p>
        </div>

        <div className="bde-anim bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-primary-orange/40 transition-colors backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-primary-orange/20 text-primary-orange flex items-center justify-center mb-6">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Guerre des Écoles</h3>
          <p className="text-text-muted">Créez votre "Squad" officielle. Vos étudiants cumulent de l'XP pour hisser votre école en haut du classement national.</p>
        </div>

        <div className="bde-anim bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-primary-purple/40 transition-colors backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-primary-purple/20 text-primary-purple flex items-center justify-center mb-6">
            <Star size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Decks Personnalisés</h3>
          <p className="text-text-muted">Possibilité de créer un jeu de cartes sur-mesure avec les "private jokes" de votre asso pour vos événements !</p>
        </div>
      </div>

      {/* Formulaire de Contact */}
      <div className="bde-anim w-full max-w-2xl bg-bg-card border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative">
        <div className="absolute -top-6 -right-6 text-6xl opacity-50 rotate-12 glow-pulse pointer-events-none">🎓</div>
        
        {submitted ? (
          <div className="flex flex-col items-center text-center py-8">
            <CheckCircle size={64} className="text-green-400 mb-6" />
            <h3 className="text-3xl font-black text-white mb-2">Demande envoyée !</h3>
            <p className="text-text-secondary">Nous contacterons votre BDE très prochainement pour mettre le feu à votre campus.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
              <Mail className="text-primary-orange" />
              Lancer le Partenariat
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2">Nom du BDE / Asso</label>
                  <input required type="text" placeholder="BDE Olympe" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-orange focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2">École / Université</label>
                  <input required type="text" placeholder="HEC Paris" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-orange focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Email de contact</label>
                <input required type="email" placeholder="contact@bde-olympe.fr" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-orange focus:outline-none transition-colors" />
              </div>
              <button type="submit" className="w-full py-4 rounded-xl font-black text-white text-lg bg-gradient-to-r from-primary-orange to-primary-pink hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(255,184,0,0.3)] flex items-center justify-center gap-2">
                <Rocket size={20} />
                Demander notre Code
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

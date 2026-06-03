"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, Smartphone, Users, Trophy, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Curseur Personnalisé (Style Portfolio)
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    const render = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary-cyan pointer-events-none z-[100] mix-blend-difference hidden md:block"
    />
  );
};

export default function LandingPage() {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2,
      });

      gsap.from(".hero-subtitle", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      });

      gsap.from(".hero-cta", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: "back.out(1.7)",
      });

      // Features Scroll Animation
      const features = gsap.utils.toArray(".feature-card");
      features.forEach((feature: any, i) => {
        gsap.from(feature, {
          scrollTrigger: {
            trigger: feature,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-dark text-white overflow-x-hidden selection:bg-primary-pink selection:text-white">
      <Cursor />
      
      {/* Navbar (Landing) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-bg-dark/50 backdrop-blur-md border-b border-white/5">
        <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-purple flex items-center gap-2">
          PYRAMIDE PARTY
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link 
              href="/play" 
              className="px-6 py-2 rounded-full font-bold bg-white text-bg-dark hover:scale-105 transition-transform"
            >
              Jouer
            </Link>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 rounded-full font-bold bg-gradient-to-r from-primary-cyan to-primary-purple hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              Connexion
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-purple/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-cyan/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="z-10 max-w-4xl">
          <h1 className="hero-title text-6xl md:text-8xl font-black mb-4 tracking-tighter leading-[1.1]">
            LE JEU DE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-pink via-primary-purple to-primary-cyan">
              SOIRÉE ULTIME
            </span>
          </h1>
          
          <p className="hero-subtitle text-lg md:text-2xl text-text-muted max-w-2xl mx-auto mt-8 mb-12">
            Multijoueur en temps réel. Défiez vos amis, représentez votre BDE et devenez la légende de la soirée.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-6">
            {user ? (
              <Link 
                href="/play"
                className="group relative px-8 py-4 bg-white text-bg-dark rounded-full font-black text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  LANCER UNE PARTIE <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-cyan to-primary-purple text-white rounded-full font-black text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  REJOINDRE LA PYRAMIDE <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            )}
            
            <a 
              href="#features"
              className="px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/5 transition-all"
            >
              Découvrir
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-muted"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent mx-auto mb-2" />
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-20 text-center">
          POURQUOI <span className="text-primary-cyan">NOUS CHOISIR ?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Smartphone size={40} />}
            title="Temps Réel"
            description="Chaque carte retournée, chaque gorgée distribuée est synchronisée instantanément sur tous les téléphones."
            color="cyan"
          />
          <FeatureCard 
            icon={<Shield size={40} />}
            title="Système de Squads"
            description="Rejoignez la Squad de votre école ou BDE et faites grimper votre classement national à chaque partie."
            color="purple"
          />
          <FeatureCard 
            icon={<Trophy size={40} />}
            title="Progression"
            description="Gagnez de l'XP, montez en niveau et débloquez des titres et des dos de cartes exclusifs dans la boutique."
            color="pink"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-text-muted">
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-purple mb-6">
          PYRAMIDE PARTY
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Pyramide Party. Tous droits réservés.</p>
        <p className="text-xs mt-2 opacity-50">L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
      </footer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: 'cyan' | 'purple' | 'pink' }) {
  const colorClasses = {
    cyan: "text-primary-cyan shadow-[0_0_30px_rgba(0,240,255,0.1)] border-primary-cyan/20",
    purple: "text-primary-purple shadow-[0_0_30px_rgba(163,0,255,0.1)] border-primary-purple/20",
    pink: "text-primary-pink shadow-[0_0_30px_rgba(255,0,255,0.1)] border-primary-pink/20",
  };

  return (
    <div className={`feature-card bg-bg-card border p-8 rounded-3xl flex flex-col gap-6 hover:scale-105 transition-transform duration-300 ${colorClasses[color]}`}>
      <div className="p-4 bg-white/5 rounded-2xl w-fit">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-text-muted leading-relaxed">
        {description}
      </p>
    </div>
  );
}

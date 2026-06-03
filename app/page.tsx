"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, Smartphone, Users, Trophy, Shield, Download, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";
import Lanyard from "@/components/Lanyard";
import { motion } from "framer-motion";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Curseur Personnalisé (Style Portfolio) - Désactivé sur mobile
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Ne pas activer le curseur sur les appareils tactiles
    if (window.matchMedia("(pointer: coarse)").matches) return;

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
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
      });

      gsap.from(".hero-subtitle", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      });

      gsap.from(".hero-cta", {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "back.out(1.7)",
      });

      // Lanyard Animation (Fade in from right)
      gsap.from(".hero-3d", {
        x: 100,
        opacity: 0,
        duration: 1.5,
        delay: 0.8,
        ease: "power3.out",
      });

      // Scroll Animations
      const fadeUps = gsap.utils.toArray(".gsap-fade-up");
      fadeUps.forEach((element: any, i) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-dark text-white overflow-x-hidden selection:bg-primary-pink selection:text-white font-sans">
      <Cursor />
      
      {/* Navbar (Landing) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-4 md:py-6 bg-bg-dark/70 backdrop-blur-xl border-b border-white/5">
        <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-purple flex items-center gap-2 tracking-tight">
          PYRAMIDE PARTY
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link 
              href="/play" 
              className="px-6 py-2 md:py-2.5 rounded-full font-bold bg-white text-bg-dark hover:scale-105 transition-transform text-sm md:text-base"
            >
              Jouer
            </Link>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 md:py-2.5 rounded-full font-bold bg-gradient-to-r from-primary-cyan to-primary-purple hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.3)] text-sm md:text-base"
            >
              Connexion
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center pt-24 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto gap-12">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary-purple/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-primary-cyan/20 blur-[100px] rounded-full pointer-events-none" />

        {/* Hero Text */}
        <div className="z-10 flex-1 text-center lg:text-left pt-12 lg:pt-0">
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-[1.1]">
            <div className="hero-title">LE JEU DE</div>
            <div className="hero-title text-transparent bg-clip-text bg-gradient-to-r from-primary-pink via-primary-purple to-primary-cyan pb-2">
              SOIRÉE ULTIME
            </div>
          </h1>
          
          <p className="hero-subtitle text-lg md:text-xl text-text-muted max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            Oubliez les jeux de cartes en papier. Lancez une partie, invitez vos amis sur leur téléphone, et survivez à la Pyramide en temps réel.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6">
            {user ? (
              <Link 
                href="/play"
                className="group relative w-full sm:w-auto px-8 py-4 bg-white text-bg-dark rounded-full font-black text-base md:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  LANCER UNE PARTIE <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-cyan to-primary-purple text-white rounded-full font-black text-base md:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  REJOINDRE LA PYRAMIDE <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            )}
            
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/5 transition-all text-center"
            >
              Découvrir
            </a>
          </div>
        </div>

        {/* Hero 3D Component */}
        <div className="hero-3d hidden lg:block w-full lg:w-1/2 h-[500px] md:h-[750px] relative mt-8 lg:mt-0 cursor-grab active:cursor-grabbing">
          {/* Lanyard renders in a Canvas and needs absolute positioning inside a wrapper to fit */}
          <div className="absolute inset-0 z-20 scale-110 md:scale-125 transform origin-center">
             <Lanyard cardTexture="/original_texture.png" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center z-30 pointer-events-none pb-4 md:hidden">
            <span className="text-[10px] text-white/50 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">Touchez la carte</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text-muted hidden md:flex flex-col items-center"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent mx-auto mb-2" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        </motion.div>
      </section>

      {/* How To Play Section */}
      <section className="py-20 md:py-32 bg-white/5 border-y border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-purple/10 via-bg-dark to-bg-dark pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 md:mb-24 gsap-fade-up">
            <h2 className="text-3xl md:text-5xl font-black mb-4">COMMENT <span className="text-primary-pink">JOUER ?</span></h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">En 3 étapes simples, transformez n'importe quel moment en une soirée inoubliable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <StepCard 
              number="01"
              title="Créez une salle"
              description="Un joueur héberge la partie depuis l'application mobile ou web. Les autres rejoignent instantanément avec un code de salle."
              icon={<Smartphone size={32} />}
            />
            <StepCard 
              number="02"
              title="Distribuez les gorgées"
              description="Le maître du jeu retourne les cartes. Si vous avez la même carte, c'est à vous de distribuer vos gorgées aux autres joueurs !"
              icon={<Users size={32} />}
            />
            <StepCard 
              number="03"
              title="Gravissez la Pyramide"
              description="Plus vous montez dans la pyramide, plus les gorgées se multiplient. Aurez-vous la meilleure stratégie pour vous venger ?"
              icon={<Trophy size={32} />}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24 gsap-fade-up">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            POURQUOI <span className="text-primary-cyan">NOUS CHOISIR ?</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">Pyramide Party n'est pas juste une application, c'est un écosystème complet pour vos soirées étudiantes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard 
            icon={<Smartphone size={40} />}
            title="Temps Réel"
            description="Chaque carte retournée, chaque gorgée distribuée est synchronisée instantanément sur tous les téléphones via Firebase."
            color="cyan"
          />
          <FeatureCard 
            icon={<Shield size={40} />}
            title="Système de Squads"
            description="Rejoignez la Squad de votre école ou BDE et faites grimper votre classement national à chaque partie remportée."
            color="purple"
          />
          <FeatureCard 
            icon={<Trophy size={40} />}
            title="Progression & Boutique"
            description="Gagnez de l'XP, montez en niveau et débloquez des titres et des dos de cartes exclusifs animés."
            color="pink"
          />
        </div>
      </section>

      {/* CTA / Download Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-bg-card to-black border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden gsap-fade-up shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-cyan/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-pink/20 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-black mb-6">Prêt à entrer dans l'arène ?</h2>
            <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto">Téléchargez l'application mobile ou jouez directement depuis votre navigateur. C'est gratuit.</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold bg-white text-bg-dark flex items-center justify-center gap-3 hover:scale-105 transition-transform text-sm md:text-base">
                <Download size={20} />
                App Store (Bientôt)
              </button>
              <button className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold bg-[#3DDC84] text-bg-dark flex items-center justify-center gap-3 hover:scale-105 transition-transform text-sm md:text-base">
                <Download size={20} />
                Play Store (Bientôt)
              </button>
              <Link href="/play" className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold border border-white/20 text-white flex items-center justify-center gap-3 hover:bg-white/5 transition-all text-sm md:text-base">
                <Smartphone size={20} />
                Rejoindre la Pyramide
              </Link>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-text-muted opacity-80 flex-wrap">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary-cyan" /> Gratuit</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary-cyan" /> Sans pub</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary-cyan" /> 100% Fun</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-text-muted bg-bg-dark/80 backdrop-blur-md">
        <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-purple mb-6 flex items-center justify-center gap-2">
          PYRAMIDE PARTY
        </div>
        <div className="flex items-center justify-center gap-6 mb-6">
          <a href="https://www.tiktok.com/@pyramideparty" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors font-bold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
            </svg>
            TikTok
          </a>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Pyramide Party. Tous droits réservés.</p>
        <p className="text-xs mt-2 opacity-50 px-4">L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
      </footer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: 'cyan' | 'purple' | 'pink' }) {
  const colorClasses = {
    cyan: "text-primary-cyan shadow-[0_0_30px_rgba(0,240,255,0.05)] border-primary-cyan/20",
    purple: "text-primary-purple shadow-[0_0_30px_rgba(163,0,255,0.05)] border-primary-purple/20",
    pink: "text-primary-pink shadow-[0_0_30px_rgba(255,0,255,0.05)] border-primary-pink/20",
  };

  return (
    <div className={`gsap-fade-up bg-bg-card/50 backdrop-blur-sm border p-6 md:p-8 rounded-3xl flex flex-col gap-4 md:gap-6 hover:scale-105 transition-transform duration-300 ${colorClasses[color]}`}>
      <div className="p-4 bg-white/5 rounded-2xl w-fit">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
      <p className="text-text-muted leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </div>
  );
}

function StepCard({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="gsap-fade-up flex flex-col items-center md:items-start text-center md:text-left relative">
      <div className="absolute -top-10 -left-6 text-[8rem] font-black text-white/5 select-none pointer-events-none z-0">
        {number}
      </div>
      <div className="relative z-10 bg-primary-cyan/10 text-primary-cyan p-4 rounded-2xl mb-6 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
        {icon}
      </div>
      <h3 className="relative z-10 text-xl md:text-2xl font-bold mb-3">{title}</h3>
      <p className="relative z-10 text-text-muted text-sm md:text-base">{description}</p>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { BookOpen, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";

export default function RulesPage() {
  const rules = [
    {
      title: "1. La Distribution",
      desc: "Chaque joueur reçoit 4 cartes face cachée. Vous avez 5 secondes pour les mémoriser. Ensuite, impossible de les regarder à nouveau !",
      icon: BookOpen,
      color: "text-primary-cyan",
      bg: "bg-primary-cyan/10"
    },
    {
      title: "2. La Pyramide",
      desc: "Des cartes sont disposées au centre en forme de pyramide. Elles sont retournées une par une, en commençant par la base.",
      icon: Sparkles,
      color: "text-primary-purple",
      bg: "bg-primary-purple/10"
    },
    {
      title: "3. Le Bluff",
      desc: "Si la carte retournée correspond au numéro d'une de vos cartes (ou si vous voulez faire croire que c'est le cas), vous pouvez 'donner' des gorgées à un autre joueur.",
      icon: ShieldAlert,
      color: "text-primary-orange",
      bg: "bg-primary-orange/10"
    },
    {
      title: "4. Tu Bluffes Martoni !",
      desc: "Le joueur ciblé peut accepter les gorgées OU crier au bluff. S'il crie au bluff, vous devez montrer la carte. Si vous avez menti, vous buvez le double ! Si vous disiez vrai, il boit le double.",
      icon: AlertTriangle,
      color: "text-primary-pink",
      bg: "bg-primary-pink/10"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen p-8 max-w-5xl mx-auto relative">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-purple mb-4">
          Le Grimoire
        </h1>
        <p className="text-xl text-text-secondary">Apprenez les règles avant de vous faire détruire en soirée.</p>
      </div>

      <div className="grid gap-8">
        {rules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, type: "spring" }}
              className="flex items-center gap-6 bg-bg-card border border-white/10 p-8 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${rule.bg}`}>
                <Icon size={40} className={rule.color} />
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-white mb-3">{rule.title}</h2>
                <p className="text-text-secondary text-lg leading-relaxed">{rule.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

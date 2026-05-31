import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone } from "lucide-react";
import useSound from "use-sound";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [playHover] = useSound('/sounds/whoosh.mp3', { volume: 0.25 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg bg-bg-dark border-2 border-primary-cyan/50 rounded-3xl p-8 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.3)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative Background Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-cyan/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-purple/20 rounded-full blur-[100px]" />

          {/* Close Button */}
          <button 
            onClick={() => { playClick(); onClose(); }}
            onMouseEnter={() => playHover()}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-cyan to-primary-purple flex items-center justify-center mb-6 shadow-lg shadow-primary-cyan/50">
              <Smartphone size={40} className="text-white drop-shadow-md" />
            </div>
            
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
              L'Expérience Complète <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-purple">
                Dans Votre Poche
              </span>
            </h2>
            
            <p className="text-text-secondary text-lg mb-8 max-w-sm">
              Pour jouer à Pyramide Party et rejoindre vos amis en ligne, téléchargez notre application mobile gratuite !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Apple Store Button */}
              <a 
                href="#"
                onMouseEnter={() => playHover()}
                onClick={() => playClick()}
                className="flex-1 group relative flex items-center justify-center gap-3 bg-black border border-white/20 hover:border-white/50 rounded-xl py-4 px-6 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg viewBox="0 0 384 512" className="w-8 h-8 fill-white">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none">Télécharger sur</span>
                  <span className="text-xl font-black text-white leading-tight">App Store</span>
                </div>
              </a>

              {/* Google Play Button */}
              <a 
                href="#"
                onMouseEnter={() => playHover()}
                onClick={() => playClick()}
                className="flex-1 group relative flex items-center justify-center gap-3 bg-black border border-white/20 hover:border-white/50 rounded-xl py-4 px-6 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg viewBox="0 0 512 512" className="w-8 h-8 fill-white">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                </svg>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none">DISPONIBLE SUR</span>
                  <span className="text-xl font-black text-white leading-tight">Google Play</span>
                </div>
              </a>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

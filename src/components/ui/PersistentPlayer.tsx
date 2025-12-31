import { motion } from "framer-motion";
import { ArrowLeft, Headphones, Radio } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function PersistentPlayer() {
  const location = useLocation();
  const isMusicPage = location.pathname === "/music";

  return (
    <div 
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
        isMusicPage ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-10"
      }`}
    >
        <div className="w-full max-w-md flex flex-col items-center gap-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <motion.div 
                    animate={{ scale: isMusicPage ? 1 : 0.9, opacity: isMusicPage ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-4"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                         <Headphones className="w-6 h-6 text-white/70" />
                    </div>
                </motion.div>
                <h1 className="text-2xl font-light tracking-wide text-white/90">Sonic Focus</h1>
                <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
                    Curated frequencies for deep work and ambient concentration.
                </p>
            </div>

            {/* Player Container - This needs to stay MOUNTED always */}
            <div className="w-full aspect-[4/5] md:aspect-square bg-black/40 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative group backdrop-blur-md">
                {/* Loading State / Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02] -z-10">
                    <Radio className="w-8 h-8 text-white/10 animate-pulse" />
                </div>

                <iframe 
                    style={{ borderRadius: '12px' }} 
                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    className="relative z-10 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                />
            </div>

            {/* Footer / Navigation */}
            <div className={`flex items-center gap-6 transition-opacity duration-500 ${isMusicPage ? "opacity-100" : "opacity-0"}`}>
                <Link 
                    to="/" 
                    className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors flex items-center gap-2 group"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>
        </div>
    </div>
  );
}

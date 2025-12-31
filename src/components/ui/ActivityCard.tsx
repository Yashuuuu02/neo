import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Clock, Zap, ChevronDown, Check } from 'lucide-react';
import type { Activity } from '@/data/activities';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);

  const categoryColors: Record<string, string> = {
    'Creative': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'Physical': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'Mental': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'Social': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Digital': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    'Clean': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] transition-colors"
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-4">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full border",
            categoryColors[activity.category] || "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
          )}>
            {activity.category}
          </span>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
             <div className="flex items-center gap-1">
               <Clock className="w-3 h-3" />
               {activity.time}
             </div>
             <div className="flex items-center gap-1">
               <Zap className="w-3 h-3" />
               {activity.energy}
             </div>
          </div>
        </div>

        <h3 className="text-xl font-medium text-white mb-2 group-hover:text-purple-300 transition-colors">
          {activity.title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          {activity.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
           <button 
             className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
           >
             {expanded ? "Show less" : "View steps"}
             <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
           </button>
           
           {/* Placeholder for favorite logic if needed later */}
           {/* <div className="w-2 h-2 rounded-full bg-white/20" /> */}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="px-6 pb-6"
          >
            <div className="pt-4 border-t border-white/5 space-y-3">
              {activity.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-sm text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[10px] text-zinc-500 font-mono mt-0.5">
                    {idx + 1}
                  </div>
                  <p>{step}</p>
                </div>
              ))}
              
              <button 
                  className="w-full mt-4 py-3 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 border border-white/5 rounded-xl text-sm text-zinc-400 transition-all flex items-center justify-center gap-2"
                  onClick={(e) => {
                      e.stopPropagation();
                      // Logic to complete? For now just visual.
                  }}
              >
                  <Check className="w-4 h-4" />
                  Mark as Complete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

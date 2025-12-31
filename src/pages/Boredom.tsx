import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { activities } from '@/data/activities';
import type { Activity, TimeFrame, EnergyLevel } from '@/data/activities';
import { Filter, Sparkles, RefreshCcw } from 'lucide-react';


export default function Boredom() {
  const [selectedTime, setSelectedTime] = useState<TimeFrame | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(null);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [shuffledActivity, setShuffledActivity] = useState<Activity | null>(null);

  // Filter Logic
  const filteredActivities = useMemo(() => {
    let result = activities;
    if (selectedTime) result = result.filter(a => a.time === selectedTime);
    if (selectedEnergy) result = result.filter(a => a.energy === selectedEnergy);
    return result;
  }, [selectedTime, selectedEnergy]);

  const handleShuffle = () => {
    setIsShuffleMode(true);
    const random = activities[Math.floor(Math.random() * activities.length)];
    setShuffledActivity(random);
  };

  const clearFilters = () => {
    setSelectedTime(null);
    setSelectedEnergy(null);
    setIsShuffleMode(false);
    setShuffledActivity(null);
  };

  // Preset Prompts
  const prompts = [
    { label: "Quick 5 min fix", time: "5min" as TimeFrame, energy: null },
    { label: "Low energy vibes", time: null, energy: "Low" as EnergyLevel },
    { label: "I want to move", time: null, energy: "High" as EnergyLevel },
    { label: "Learn something", time: "15min" as TimeFrame, energy: "Medium" as EnergyLevel },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
      
      <div className="container mx-auto px-4 py-24 md:py-32 max-w-5xl">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
               className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-orange-500/10 border border-white/5 mb-4"
            >
                <Sparkles className="w-6 h-6 text-purple-300" />
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-6xl font-light tracking-tight"
            >
                Cure your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400 font-normal">boredom</span>.
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-zinc-400 max-w-lg mx-auto"
            >
                Discover something new to do. Filter by your vibe or let chaos decide.
            </motion.p>
        </div>

        {/* Chat / Prompts Area */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
            {prompts.map((prompt, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        setIsShuffleMode(false);
                        setSelectedTime(prompt.time);
                        setSelectedEnergy(prompt.energy);
                    }}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-zinc-300 hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                    {prompt.label}
                </button>
            ))}
            <button
                onClick={handleShuffle}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-orange-600/20 hover:from-purple-600/30 hover:to-orange-600/30 border border-purple-500/30 text-sm text-purple-200 hover:text-white transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
                <RefreshCcw className="w-3 h-3" />
                Surprise Me
            </button>
        </motion.div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
             <div className="flex items-center gap-2 text-sm text-zinc-500">
                 <Filter className="w-4 h-4" />
                 <span>Filters:</span>
                 
                 <select 
                    value={selectedTime || ""} 
                    onChange={(e) => {
                        setIsShuffleMode(false);
                        setSelectedTime(e.target.value as TimeFrame || null);
                    }}
                    className="bg-transparent border-none text-zinc-300 focus:ring-0 cursor-pointer hover:text-white transition-colors"
                 >
                     <option value="">Any Time</option>
                     <option value="5min">5 Minutes</option>
                     <option value="15min">15 Minutes</option>
                     <option value="30min">30 Minutes</option>
                     <option value="1hr+">1 Hour+</option>
                 </select>

                 <span className="text-zinc-700">|</span>

                 <select 
                    value={selectedEnergy || ""} 
                    onChange={(e) => {
                        setIsShuffleMode(false);
                        setSelectedEnergy(e.target.value as EnergyLevel || null);
                    }}
                    className="bg-transparent border-none text-zinc-300 focus:ring-0 cursor-pointer hover:text-white transition-colors"
                 >
                     <option value="">Any Energy</option>
                     <option value="Low">Low Energy</option>
                     <option value="Medium">Medium Energy</option>
                     <option value="High">High Energy</option>
                 </select>
             </div>

             {(selectedTime || selectedEnergy || isShuffleMode) && (
                 <button 
                    onClick={clearFilters}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                 >
                     Clear Filters
                 </button>
             )}
        </div>

        {/* Results Grid */}
        <div className="min-h-[400px]">
            {isShuffleMode && shuffledActivity ? (
                <div className="max-w-md mx-auto">
                    <ActivityCard activity={shuffledActivity} />
                    <div className="text-center mt-8">
                        <button 
                            onClick={handleShuffle}
                            className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center gap-2 mx-auto"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Spin again
                        </button>
                    </div>
                </div>
            ) : (
                <>
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence mode="popLayout">
                          {filteredActivities.map((activity) => (
                              <ActivityCard key={activity.id} activity={activity} />
                          ))}
                      </AnimatePresence>
                  </motion.div>
                  
                  {filteredActivities.length === 0 && (
                      <div className="text-center py-20 text-zinc-500">
                          <p>No activities found matching those filters.</p>
                          <button onClick={clearFilters} className="text-purple-400 mt-2 hover:underline">Reset</button>
                      </div>
                  )}
                </>
            )}
        </div>

      </div>
    </div>
  );
}

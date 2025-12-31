import type { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { BlockRenderer } from './BlockRenderer';
import { motion } from 'framer-motion';
import { Sparkles, Monitor, Brain, Share2 } from 'lucide-react';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  // Interaction Mode Badges
  const ModeBadge = () => {
    if (!message.mode || message.mode === 'default') return null;
    
    const config = {
      think: { icon: Brain, label: 'Thinking', color: 'text-amber-400 border-amber-400/20 bg-amber-400/10' },
      search: { icon: Share2, label: 'Searching', color: 'text-blue-400 border-blue-400/20 bg-blue-400/10' },
      canvas: { icon: Monitor, label: 'Canvas', color: 'text-purple-400 border-purple-400/20 bg-purple-400/10' },
    }[message.mode];

    if (!config) return null;
    const Icon = config.icon;

    return (
        <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider mb-2 select-none", config.color)}>
            <Icon className="w-3 h-3" />
            {config.label}
        </div>
    );
  };

  if (isUser) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-end mb-8 pl-12"
      >
        <ModeBadge />
        <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl rounded-tr-sm text-white/90 text-[15px] leading-relaxed max-w-xl shadow-sm border border-white/5">
            {message.content}
        </div>
      </motion.div>
    );
  }

  // Assistant Message
  let blocks: any[] = [];
  try {
     const parsed = JSON.parse(message.content);
     if (parsed.blocks) blocks = parsed.blocks;
  } catch (e) {
     // Fallback for plain text or legacy messages
     blocks = [{ type: 'paragraph', content: message.content }];
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center w-full mb-12"
    >
        <div className="w-full max-w-2xl px-4 md:px-0">
            {/* Avatar / Identity */}
            <div className="flex items-center gap-3 mb-6 opacity-40">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium tracking-widest uppercase">System</span>
            </div>
            
            {/* Reasoning Panel */}
            {message.reasoning && message.reasoning.length > 0 && (
                <details className="mb-6 group">
                    <summary className="list-none cursor-pointer select-none inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
                        <span className="group-open:rotate-90 transition-transform duration-200">▶</span>
                         REASONING_TRACE
                    </summary>
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-3 pl-4 border-l border-white/5 overflow-hidden"
                    >
                        <div className="font-mono text-xs text-zinc-500 space-y-1 py-2">
                            {message.reasoning.map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="opacity-50">{(i + 1).toString().padStart(2, '0')}:</span>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </details>
            )}

            {/* Content using structured blocks */}
            <div className="prose prose-invert max-w-none">
                {blocks.map((block, i) => (
                    <BlockRenderer key={i} block={block} />
                ))}
            </div>
        </div>
    </motion.div>
  );
}

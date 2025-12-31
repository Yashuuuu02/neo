import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, Loader2, X, Maximize2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface BookDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  ia?: string[]; // Internet Archive keys
}

interface SearchResponse {
  numFound: number;
  docs: BookDoc[];
}

export default function Reading() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<BookDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookDoc | null>(null);
  
  // Custom debounce implementation
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedQuery = useDebounce(query, 500);

  const searchBooks = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setBooks([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=20`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data: SearchResponse = await response.json();
      // Filter books to prioritize those with both covers and Internet Archive keys
      setBooks(data.docs.filter(doc => doc.cover_i));
    } catch (err) {
      console.error(err);
      setError('Could not find books. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      searchBooks(debouncedQuery);
    } else {
      setBooks([]);
    }
  }, [debouncedQuery, searchBooks]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30">
      
      <div className="container mx-auto px-4 py-24 md:py-32 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="flex justify-center">
               <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                 <Book className="w-8 h-8 text-emerald-400" />
               </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
              The Library
            </h1>
            <p className="text-zinc-400 max-w-lg mx-auto text-lg font-light leading-relaxed">
              Curated knowledge from the open web. Search for books, papers, and archives.
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl relative group"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books, authors, or subjects..."
              className={cn(
                "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-lg outline-none",
                "focus:border-emerald-500/50 focus:bg-white/10 focus:ring-1 focus:ring-emerald-500/50 transition-all",
                "placeholder:text-zinc-600"
              )}
            />
            {loading && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
              </div>
            )}
          </motion.div>
          {error && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-red-400 text-sm"
             >
               {error}
             </motion.div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {books.map((book, index) => (
              <motion.div
                key={book.key}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Book Cover Aspect Ratio Container */}
                <div className="aspect-[2/3] w-full relative overflow-hidden bg-zinc-900/50">
                  {book.cover_i ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <Book className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    {book.ia && book.ia.length > 0 ? (
                      <button 
                        onClick={() => setSelectedBook(book)}
                        className="px-6 py-2 bg-emerald-500 text-black font-medium rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 hover:bg-emerald-400"
                      >
                        <span>Read Now</span>
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    ) : (
                       <a 
                        href={`https://openlibrary.org${book.key}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-white/10 text-white font-medium rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 hover:bg-white/20"
                      >
                        <span>Details</span>
                        <Book className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-zinc-100 line-clamp-1 group-hover:text-emerald-400 transition-colors" title={book.title}>
                    {book.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span className="line-clamp-1 max-w-[70%]">
                      {book.author_name ? book.author_name[0] : 'Unknown Author'}
                    </span>
                    <span>{book.first_publish_year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && books.length === 0 && query.trim() !== '' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-zinc-500"
          >
            <p>No volumes found matching your query.</p>
          </motion.div>
        )}
        
        {/* Initial State */}
        {!loading && books.length === 0 && query.trim() === '' && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-zinc-400 text-sm border border-white/5">
              <span>Try searching for</span>
              <span className="text-zinc-200">"Isaac Asimov"</span>
              <span>or</span>
              <span className="text-zinc-200">"Cybernetics"</span>
            </div>
          </motion.div>
        )}

      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedBook && selectedBook.ia && selectedBook.ia.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full h-full max-w-6xl max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Toolbar */}
              <div className="h-14 bg-black/50 border-b border-white/10 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                   <Book className="w-5 h-5 text-emerald-500" />
                   <h2 className="font-medium text-white truncate max-w-[200px] md:max-w-md">
                     {selectedBook.title}
                   </h2>
                </div>
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </div>
              
              {/* Embed Player */}
              <div className="flex-1 bg-black relative">
                 <iframe 
                   src={`https://archive.org/embed/${selectedBook.ia[0]}`} 
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   allowFullScreen
                   className="absolute inset-0"
                 />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




export default function Music() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-violet-500/30">
        
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] opacity-30" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] opacity-20" />
        </div>
        
    </div>
  );
}

import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/ui/Navigation';
import { PersistentPlayer } from './components/ui/PersistentPlayer';
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Music = lazy(() => import('./pages/Music'));
const Reading = lazy(() => import('./pages/Reading'));
const Boredom = lazy(() => import('./pages/Boredom'));
const SplineDemo = lazy(() => import('./pages/Demo').then(module => ({ default: module.SplineDemo })));

function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black text-white">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <PersistentPlayer />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<SplineDemo />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/music" element={<Music />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/boredom" element={<Boredom />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

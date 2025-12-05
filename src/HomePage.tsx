import React, { useState, useEffect } from 'react';
import { Pencil, Layers, Download, Undo2, ZoomIn, Moon, Sun, Smartphone, ArrowRight } from 'lucide-react';
import DrawingApp from './DrawingApp';

const HomePage: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Pencil className="w-5 h-5" />, label: "Drawing Tools" },
    { icon: <Layers className="w-5 h-5" />, label: "Multi-Page" },
    { icon: <Undo2 className="w-5 h-5" />, label: "Undo/Redo" },
    { icon: <ZoomIn className="w-5 h-5" />, label: "Zoom" },
    { icon: <Download className="w-5 h-5" />, label: "Export" },
    { icon: <Smartphone className="w-5 h-5" />, label: "Mobile Ready" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden ${
      theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'
    }`}>

      {/* Animated background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl animate-pulse ${
            theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'
          }`}
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div
          className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-fuchsia-500/10' : 'bg-fuchsia-500/5'
          }`}
          style={{ animation: 'float 10s ease-in-out infinite reverse' }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
          theme === 'dark' ? 'opacity-20' : 'opacity-40'
        }`}
        style={{
          backgroundImage: theme === 'dark'
            ? 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-30 px-6 py-4 transition-all duration-700 ${
        isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold tracking-tight flex items-center gap-2 group cursor-pointer">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 bg-gradient-to-br from-purple-600 to-fuchsia-600`}>
              <Pencil className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Brushsy
            </span>
          </span>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
              theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700'
                : 'bg-zinc-200 hover:bg-zinc-300'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6 transition-all duration-700 ${
              isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            } ${
              theme === 'dark'
                ? 'bg-zinc-800/80 text-zinc-300 border border-zinc-700'
                : 'bg-white/80 text-zinc-600 border border-zinc-200 shadow-sm'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Free & Open Source
          </div>

          {/* Headline */}
          <h1
            className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <span className="inline-block hover:scale-105 transition-transform cursor-default">Draw.</span>{' '}
            <span className="inline-block hover:scale-105 transition-transform cursor-default bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Create.</span>{' '}
            <span className="inline-block hover:scale-105 transition-transform cursor-default">Export.</span>
          </h1>

          <p
            className={`text-lg md:text-xl mb-10 max-w-xl mx-auto transition-all duration-700 delay-200 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } ${
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            A simple, fast drawing app that works right in your browser. No sign-up required.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-700 delay-300 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <button
              onClick={() => setIsCanvasOpen(true)}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 active:scale-95"
            >
              <Pencil className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Start Drawing
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                theme === 'dark'
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Source
            </a>
          </div>

          {/* Features */}
          <div
            className={`flex flex-wrap justify-center gap-3 transition-all duration-700 delay-400 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {features.map((feature, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 cursor-default ${
                  activeFeature === i
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white scale-105 shadow-lg shadow-purple-500/25'
                    : theme === 'dark'
                      ? 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
                      : 'bg-white/80 text-zinc-600 hover:bg-white hover:text-zinc-800 shadow-sm'
                }`}
                onMouseEnter={() => setActiveFeature(i)}
              >
                {feature.icon}
                {feature.label}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Preview */}
        <div
          className={`w-full max-w-4xl mx-auto mt-16 mb-8 transition-all duration-1000 delay-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div
            className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group ${
              theme === 'dark'
                ? 'bg-zinc-900 shadow-xl shadow-black/50 ring-1 ring-zinc-800'
                : 'bg-white shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200'
            }`}
            onClick={() => setIsCanvasOpen(true)}
          >
            {/* Mock toolbar */}
            <div className={`flex items-center gap-2 px-4 py-3 border-b ${
              theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'
            }`}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
              </div>
              <div className={`flex-1 text-center text-sm ${
                theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                Untitled — Brushsy
              </div>
            </div>

            {/* Mock canvas area */}
            <div className={`relative aspect-[16/9] ${theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
              {/* Grid pattern */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  theme === 'dark' ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundImage: theme === 'dark'
                    ? 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)'
                    : 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Animated sample drawings */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450">
                {/* Animated Circle */}
                <circle
                  cx="180" cy="140" r="50"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3"
                  strokeDasharray="314"
                  className="animate-draw"
                  style={{ animation: 'draw 2s ease-out forwards' }}
                />

                {/* Animated Rectangle */}
                <rect
                  x="340" y="90" width="100" height="70"
                  fill="none"
                  stroke="#d946ef"
                  strokeWidth="3"
                  strokeDasharray="340"
                  style={{ animation: 'draw 2s ease-out 0.3s forwards' }}
                />

                {/* Animated Squiggle */}
                <path
                  d="M 520 100 Q 560 60 600 110 Q 640 160 680 120 Q 720 80 750 130"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="300"
                  style={{ animation: 'draw 2s ease-out 0.6s forwards' }}
                />

                {/* Animated Triangle */}
                <path
                  d="M 150 350 L 220 250 L 290 350 Z"
                  fill="none"
                  stroke="#c026d3"
                  strokeWidth="3"
                  strokeDasharray="350"
                  style={{ animation: 'draw 2s ease-out 0.9s forwards' }}
                />

                {/* Animated Wave */}
                <path
                  d="M 350 300 Q 420 240 490 300 Q 560 360 630 300 Q 700 240 750 300"
                  fill="none"
                  stroke={theme === 'dark' ? '#fff' : '#18181b'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="500"
                  style={{ animation: 'draw 2.5s ease-out 1.2s forwards' }}
                />

                {/* Cursor animation */}
                <g style={{ animation: 'cursor-move 4s ease-in-out infinite' }}>
                  <circle r="8" fill="#a855f7" opacity="0.3">
                    <animate attributeName="cx" values="180;450;650;400;180" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="140;300;120;320;140" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4" fill="#a855f7">
                    <animate attributeName="cx" values="180;450;650;400;180" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="140;300;120;320;140" dur="4s" repeatCount="indefinite" />
                  </circle>
                </g>
              </svg>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                <span className={`px-6 py-3 rounded-xl text-sm font-medium transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ${
                  theme === 'dark' ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
                }`}>
                  Click to start drawing →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className={`pb-8 text-sm transition-all duration-700 delay-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
          }`}
        >
          Built with React + TypeScript + Canvas API
        </footer>
      </main>

      {/* Drawing App Modal */}
      {isCanvasOpen && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <DrawingApp onClose={() => setIsCanvasOpen(false)} />
        </div>
      )}

      {/* Custom styles for animations */}
      <style>{`
        @keyframes draw {
          from {
            stroke-dashoffset: 500;
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;

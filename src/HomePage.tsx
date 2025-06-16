import React, { useState, useEffect } from 'react';
import { Palette, Zap, Download, Moon, Sun } from 'lucide-react';
import DrawingApp from './DrawingApp'; 

const HomePage: React.FC = () => { 
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

  const openCanvas = (): void => {
    setIsCanvasOpen(true);
  };

  const toggleTheme = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      const heroContent = document.querySelector('.hero-content') as HTMLElement;
      if (heroContent) {
        const translateX = (mouseX - 0.5) * 20;
        const translateY = (mouseY - 0.5) * 20;
        heroContent.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }
    };

    const handleScroll = (): void => {
      const scrolled = window.pageYOffset;
      const elements = document.querySelectorAll('.floating-element');

      elements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.15);
        const rotate = scrolled * (0.1 + index * 0.05);
        (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px) rotate(${rotate}deg)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  const features = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Advanced Brushes",
      description: "Professional-grade brush engines with realistic texture simulation, pressure sensitivity, and infinite customization options for every artistic style."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized performance with real-time rendering, instant undo/redo, and smooth 60fps drawing experience even with complex compositions."
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Smart Export",
      description: "Export in multiple formats including vector PDF, high-resolution PNG, and web-optimized formats with intelligent compression algorithms."
    }
  ];

  const FloatingElement: React.FC<{
    size: string;
    position: string;
    delay: string;
  }> = ({ size, position, delay }) => (
    <div
      className={`floating-element absolute rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-10 ${size} ${position}`}
      style={{
        animation: `complexFloat 12s ease-in-out infinite ${delay}`,
        filter: 'blur(1px)'
      }}
    />
  );

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out relative overflow-x-hidden ${
      theme === 'dark'
        ? 'bg-black text-white'
        : 'bg-white text-slate-800'
    }`}>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute inset-0 opacity-40 animate-gradient-shift ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-pink-500/20 via-transparent to-rose-500/20'
              : 'bg-gradient-to-br from-pink-100 via-transparent to-rose-100'
          }`}
          style={{ backgroundSize: '60px 60px' }} 
        />

        <div
          className={`absolute inset-0 opacity-50 animate-mesh-move ${
            theme === 'dark'
              ? 'bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]'
              : 'bg-[linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)]'
          }`}
          style={{ backgroundSize: '60px 60px' }}
        />
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        <FloatingElement size="w-25 h-25" position="top-[15%] left-[8%]" delay="0s" />
        <FloatingElement size="w-15 h-15" position="top-[45%] right-[12%]" delay="3s" />
        <FloatingElement size="w-30 h-30" position="bottom-[25%] left-[15%]" delay="6s" />
        <FloatingElement size="w-20 h-20" position="top-[70%] right-[8%]" delay="9s" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-8">
        <header className="py-8 relative backdrop-blur-xl">
          <nav
            className="flex justify-between items-center opacity-0 animate-slide-in-down"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            <a
              href="#"
              className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent relative group transition-all duration-400"
            >
              Brushsy
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-400 blur-xl -z-10" />
            </a>

            <button
              onClick={toggleTheme}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-400 backdrop-blur-xl hover:transform hover:-translate-y-0.5 relative overflow-hidden group ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 hover:shadow-lg hover:shadow-pink-500/30'
                  : 'bg-black/5 border-black/10 hover:shadow-lg hover:shadow-pink-500/20'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
              {theme === 'dark' ? <Sun className="w-5 h-5 relative z-10" /> : <Moon className="w-5 h-5 relative z-10" />}
            </button>
          </nav>
        </header>

        <main className="min-h-[85vh] flex items-center text-center relative">
          <div className="hero-content w-full relative transition-transform duration-300 ease-out">

            <h1
              className={`text-6xl md:text-8xl font-extrabold mb-8 leading-none opacity-0 animate-slide-in-up ${
                theme === 'dark'
                  ? 'bg-gradient-to-b from-white to-gray-400'
                  : 'bg-gradient-to-b from-slate-900 to-slate-600'
              } bg-clip-text text-transparent`}
              style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
            >
              Create Without<br/>Boundaries
            </h1>

            <p
              className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light opacity-0 animate-slide-in-up ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
              }`}
              style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
            >
              Experience the future of digital drawing with advanced tools,
              seamless workflows, and unlimited creative possibilities.
            </p>

            <div
              className="grid md:grid-cols-3 gap-8 mb-20 opacity-0 animate-slide-in-up"
              style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative p-10 rounded-3xl border backdrop-blur-xl transition-all duration-700 hover:-translate-y-4 hover:scale-105 transform-gpu cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 hover:border-pink-500/30 shadow-2xl shadow-black/50'
                      : 'bg-white/80 border-gray-200 hover:border-pink-500/30 shadow-2xl shadow-black/10'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.transform = 'translateY(-15px) rotateX(5deg) rotateY(5deg) scale(1.05)';
                    target.style.boxShadow = theme === 'dark'
                      ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 50px rgba(236, 72, 153, 0.3)'
                      : '0 25px 50px rgba(0, 0, 0, 0.1), 0 0 50px rgba(236, 72, 153, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.transform = '';
                    target.style.boxShadow = theme === 'dark'
                      ? '0 25px 50px rgba(0, 0, 0, 0.5)'
                      : '0 25px 50px rgba(0, 0, 0, 0.1)';
                  }}
                >

                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div
                    className="relative z-10 w-18 h-18 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-8 mx-auto text-white transition-all duration-700 group-hover:scale-110 group-hover:rotate-y-180"
                    style={{
                      boxShadow: '0 15px 30px rgba(236, 72, 153, 0.3)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {feature.icon}
                  </div>

                  <div className="relative z-10">
                    <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-700 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed transition-colors duration-700 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mb-32">
              <button
                onClick={openCanvas}
                className="group inline-flex items-center gap-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-12 py-5 text-xl font-semibold rounded-full transition-all duration-700 hover:-translate-y-2 hover:scale-105 relative overflow-hidden opacity-0 animate-slide-in-up shadow-2xl shadow-pink-500/30"
                style={{
                  animationDelay: '1s',
                  animationFillMode: 'forwards',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.boxShadow = '0 25px 50px rgba(236, 72, 153, 0.3), 0 0 80px rgba(236, 72, 153, 0.3)';

                  const ripple = document.createElement('div');
                  ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none';
                  const rect = target.getBoundingClientRect();
                  ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
                  ripple.style.left = `${e.clientX - rect.left - parseFloat(ripple.style.width) / 2}px`;
                  ripple.style.top = `${e.clientY - rect.top - parseFloat(ripple.style.height) / 2}px`;
                  ripple.style.transform = 'scale(0)';
                  ripple.style.animation = 'ripple 0.6s linear';

                  target.appendChild(ripple);

                  setTimeout(() => {
                    ripple.remove();
                  }, 600);
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.boxShadow = '0 25px 50px rgba(236, 72, 153, 0.3)';
                }}
              >

                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />

                <span className="relative z-10">Launch Canvas</span>
                <span className="relative z-10 transition-transform duration-700 group-hover:translate-x-2 group-hover:rotate-45">
                  →
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full" />
              </button>
            </div>

          </div>
          {isCanvasOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <DrawingApp onClose={() => setIsCanvasOpen(false)} />
        </div>
      )}
        </main>


      </div>
    </div>
  );
};

export default HomePage;

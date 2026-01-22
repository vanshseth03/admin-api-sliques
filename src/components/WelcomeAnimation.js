import React, { useState, useEffect } from 'react';

const WelcomeAnimation = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0: initial, 1: logo, 2: tagline, 3: fade out
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Always show animation - no session check
    // Start animation immediately
    const timer0 = setTimeout(() => setPhase(1), 100); // Start logo
    const timer1 = setTimeout(() => setPhase(2), 600); // Show tagline
    const timer2 = setTimeout(() => setPhase(3), 1400); // Start fade out
    const timer3 = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 1900); // Complete

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        phase === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#FBF9F6' }}
    >
      {/* Decorative fabric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111317' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Gold accent circles */}
      <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full blur-3xl" 
           style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full blur-3xl" 
           style={{ backgroundColor: 'rgba(201, 162, 39, 0.08)' }} />

      {/* Main content */}
      <div className="relative text-center px-6">
        {/* Scissors icon - boutique theme */}
        <div className={`mb-4 transition-all duration-500 ${
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <svg 
            className="w-10 h-10 mx-auto" 
            style={{ color: '#C9A227' }} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
          </svg>
        </div>

        {/* Brand Name */}
        <h1 
          className={`font-playfair text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[0.2em] transition-all duration-700 ease-out ${
            phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ color: '#111317' }}
        >
          SLIQUES
        </h1>

        {/* Gold underline */}
        <div 
          className={`mx-auto mt-3 h-0.5 transition-all duration-500 ease-out ${
            phase >= 1 ? 'w-16 opacity-100' : 'w-0 opacity-0'
          }`}
          style={{ backgroundColor: '#C9A227' }}
        />

        {/* Tagline */}
        <p 
          className={`mt-4 text-xs sm:text-sm tracking-[0.15em] font-medium transition-all duration-500 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ color: '#666' }}
        >
          CONTEMPORARY BOUTIQUE
        </p>

        {/* Service keywords */}
        <div 
          className={`mt-3 flex items-center justify-center gap-2 text-xs transition-all duration-500 delay-100 ${
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color: '#999' }}
        >
          <span>Tailoring</span>
          <span style={{ color: '#C9A227' }}>✦</span>
          <span>Custom Outfits</span>
          <span style={{ color: '#C9A227' }}>✦</span>
          <span>Bridal Wear</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;

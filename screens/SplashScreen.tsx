
import React from 'react';
import { Icons } from '../constants';

const SplashScreen: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] transition-opacity duration-1000 ${className}`}>
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        
        {/* Centered Logo Group */}
        <div className="flex flex-col items-center justify-center animate-fade-in space-y-12">
          {/* Logo with Pulse Glow Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#F5D56A] opacity-20 blur-[60px] rounded-full animate-pulse-glow"></div>
            <Icons.Logo className="w-72 md:w-96 relative z-10 animate-pulse-glow" />
          </div>
          
          {/* Version & Credits Group */}
          <div className="flex flex-col items-center space-y-4 animate-fade-in mt-8" style={{ animationDelay: '0.8s' }}>
            <span className="font-serif tracking-[0.2em] text-[#F5D48B] text-opacity-90 text-sm">
              Version 1.0
            </span>
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#F5D48B] text-opacity-60">
              Built With Love
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SplashScreen;

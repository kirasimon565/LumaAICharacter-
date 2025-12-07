import React from 'react';
import { Icons } from '../constants';

const DeveloperScreen = () => {
  return (
    <div className="p-6 flex flex-col items-center text-center min-h-[80vh] justify-center">
       <Icons.Logo className="w-40 mb-8 opacity-80" />
       
       <h2 className="text-2xl font-serif text-white mb-2">LumaAI Platform</h2>
       <p className="text-[#F5D48B] mb-8">Version 1.0.0-beta</p>

       <div className="glass-panel p-6 rounded-xl w-full max-w-sm space-y-2 mb-8">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Credits</p>
          <p className="text-white font-serif text-lg">Phoenix Cameron</p>
          <p className="text-gray-500 text-xs">Lead Architect</p>
       </div>

       <div className="space-y-2 text-xs text-gray-600">
         <p>Running MLCEngine v0.2.x</p>
         <p>Model: LumaAI-160M-v3 (Quantized)</p>
       </div>
    </div>
  );
};

export default DeveloperScreen;
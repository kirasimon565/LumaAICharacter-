import React from 'react';
import { Button } from '../components/UI';

const SettingsScreen = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-serif text-[#F5D48B] mb-8">Settings</h2>
      
      <div className="space-y-6">
        <section>
            <h3 className="text-white mb-4 font-serif text-lg">Model Configuration</h3>
            <div className="glass-panel p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Cache Model</span>
                    <div className="w-10 h-5 bg-[#F5D48B] rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full"></div>
                    </div>
                </div>
                <Button variant="ghost" className="text-xs text-red-400 justify-start px-0">Clear WebLLM Cache</Button>
            </div>
        </section>

        <section>
            <h3 className="text-white mb-4 font-serif text-lg">Appearance</h3>
            <div className="glass-panel p-4 rounded-lg">
                <div className="flex justify-between items-center text-gray-400 text-sm">
                    Theme is locked to <span className="text-[#F5D48B]">Noir Luxury</span>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsScreen;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { api, getFileUrl } from '../services/pocketbaseService';
import { Character } from '../types';
import { Card, LoadingSpinner } from '../components/UI';
import { Icons } from '../constants';

const HomeScreen = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const list = await api.getCharacters();
        setCharacters(list);
      } catch (e) {
        console.error("Failed to load characters", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-end mb-8">
        <div>
           <Icons.Logo className="w-24 mb-2" />
           <p className="text-gray-400 font-serif">Welcome back, <span className="text-[#F5D48B]">{user?.displayName || 'Traveler'}</span></p>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => navigate('/create')} className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors aspect-square border-l-2 border-[#F5D48B]">
          <Icons.Create className="w-8 h-8 text-[#F5D48B]" />
          <span className="font-serif text-sm">Create Character</span>
        </button>
         <button onClick={() => navigate('/chats')} className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors aspect-square">
          <Icons.Chat className="w-8 h-8 text-gray-300" />
          <span className="font-serif text-sm">Your Chats</span>
        </button>
      </div>

      <h3 className="font-serif text-xl text-[#F5D48B] mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#F5D48B] rounded-full"></span>
        Your Characters
      </h3>

      {loading ? (
        <div className="flex justify-center p-8"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-4">
          {characters.length === 0 ? (
             <div className="glass-panel p-6 rounded-xl text-center border border-white/5">
               <p className="text-gray-400 mb-2">No characters found.</p>
               <button onClick={() => navigate('/create')} className="text-[#F5D48B] text-sm hover:underline">Create your first character</button>
             </div>
          ) : (
            characters.map(char => (
              <div 
                key={char.id} 
                onClick={() => navigate(`/character/${char.id}`)}
                className="glass-panel rounded-xl overflow-hidden flex items-center gap-4 p-2 cursor-pointer hover:bg-white/5 transition-all"
              >
                <img 
                  src={getFileUrl(char.id, 'characters', char.Image || '')} 
                  alt={char.name}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-900 border border-white/5"
                />
                <div>
                  <h4 className="font-serif text-lg text-white">{char.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{char.greeting}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pb, getFileUrl, api } from '../services/pocketbaseService';
import { Character } from '../types';
import { Button, LoadingSpinner } from '../components/UI';
import { Icons } from '../constants';

const CharacterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChar = async () => {
      try {
        if(id) {
          const record = await pb.collection('characters').getOne<Character>(id);
          setCharacter(record);
        }
      } catch (e) {
        console.error(e);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchChar();
  }, [id, navigate]);

  const handleStartChat = async () => {
    if(!character) return;
    try {
        const chat = await api.createChat(character.id);
        navigate(`/chat/${chat.id}`);
    } catch(e) {
        console.error("Error creating chat", e);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!character) return null;

  return (
    <div className="min-h-screen relative">
      {/* Hero Image */}
      <div className="h-[40vh] w-full relative">
        <img 
            src={getFileUrl(character.id, 'characters', character.Image || '')} 
            className="w-full h-full object-cover"
            alt={character.name}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 text-white bg-black/50 p-2 rounded-full backdrop-blur-md">
            <Icons.Back />
        </button>
      </div>

      <div className="p-6 relative -mt-10">
        <h1 className="text-4xl font-serif text-white mb-2 text-glow">{character.name}</h1>
        <div className="flex gap-2 mb-6">
            <span className="bg-[#F5D48B]/20 text-[#F5D48B] px-3 py-1 rounded-full text-xs border border-[#F5D48B]/30 uppercase tracking-widest">
                {character.visibility}
            </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl mb-8 space-y-4">
            <h3 className="font-serif text-[#F5D48B] text-lg border-b border-white/10 pb-2">Backstory</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{character.backstory || "No backstory provided."}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl mb-24 space-y-4">
            <h3 className="font-serif text-[#F5D48B] text-lg border-b border-white/10 pb-2">Personality</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{character.personality || "No personality details."}</p>
        </div>

        <div className="fixed bottom-20 left-0 w-full p-6 bg-gradient-to-t from-black via-black to-transparent">
            <Button onClick={handleStartChat}>Start Conversation</Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
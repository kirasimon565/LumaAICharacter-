import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, pb, getFileUrl } from '../services/pocketbaseService';
import { lumaLLM } from '../services/webllmService';
import { Chat, Message, Sender, Character } from '../types';
import { Icons } from '../constants';
import { LoadingSpinner } from '../components/UI';

const ChatScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Data & Model
  useEffect(() => {
    const init = async () => {
      if (!id) return;
      try {
        const chatData = await pb.collection('chats').getOne<Chat>(id, { expand: 'character,activePersona' });
        setChat(chatData);
        
        const history = await api.getMessages(id);
        setMessages(history);

        // If no history, add greeting from character locally (and save later or assume user sees it)
        if (history.length === 0 && chatData.expand?.character?.greeting) {
            const greetingMsg: Message = {
                id: 'greeting',
                chat: chatData.id,
                sender: Sender.AI,
                text: chatData.expand.character.greeting,
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            };
            setMessages([greetingMsg]);
        }

        // Initialize LLM
        if (!lumaLLM.isLoaded) {
          await lumaLLM.initialize((p) => setLoadProgress(p));
        }
        setIsModelLoading(false);
      } catch (e) {
        console.error(e);
        navigate('/');
      }
    };
    init();
  }, [id, navigate]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chat || isGenerating) return;

    const userText = inputValue;
    setInputValue('');
    
    // Optimistic UI for User
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      chat: chat.id,
      sender: Sender.USER,
      text: userText,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      await api.sendMessage(chat.id, userText, 'user');
      setIsGenerating(true);

      // Prepare Prompt
      const char = chat.expand?.character;
      const systemPrompt = `
        You are ${char?.name}. 
        Personality: ${char?.personality}
        Backstory: ${char?.backstory}
        Instructions: ${char?.instructions}
        Stay in character. Do not break the fourth wall.
      `;

      // Construct history string (simplified context window)
      const context = messages.slice(-10).map(m => `${m.sender === Sender.USER ? 'User' : char?.name}: ${m.text}`).join('\n');
      const fullPrompt = `${context}\nUser: ${userText}\n${char?.name}:`;

      // Streaming Response container
      const aiMsgId = `ai-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: aiMsgId,
        chat: chat.id,
        sender: Sender.AI,
        text: '...',
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }]);

      let finalText = "";
      
      await lumaLLM.generateResponse(
        fullPrompt,
        systemPrompt,
        { temperature: 0.7, top_p: 0.9, repetition_penalty: 1.0 },
        (partialText) => {
           finalText = partialText;
           setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: partialText } : m));
           // Scroll during generation
           if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      );

      setIsGenerating(false);
      await api.sendMessage(chat.id, finalText, 'ai');

    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  if (isModelLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-8">
        <Icons.Logo className="w-32 mb-8" />
        <div className="w-full max-w-xs h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#F5D48B] transition-all duration-300" style={{ width: `${loadProgress}%` }}></div>
        </div>
        <p className="mt-4 text-xs font-serif text-gray-400">Summoning Intelligence... {Math.round(loadProgress)}%</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 bg-black/80 backdrop-blur-md z-10">
        <button onClick={() => navigate('/chats')} className="text-gray-400 mr-4"><Icons.Back /></button>
        <img 
          src={getFileUrl(chat?.expand?.character?.id || '', 'characters', chat?.expand?.character?.image || '')} 
          className="w-10 h-10 rounded-full object-cover border border-[#F5D48B]/50"
          alt="char"
        />
        <div className="ml-3">
          <h3 className="text-white font-serif">{chat?.expand?.character?.name}</h3>
          <span className="flex items-center gap-1 text-[10px] text-[#F5D48B]">
             <span className="w-1.5 h-1.5 bg-[#F5D48B] rounded-full animate-pulse"></span> Online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => {
            const isUser = msg.sender === Sender.USER;
            return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 ${
                        isUser 
                        ? 'bg-white/10 text-white rounded-br-none border border-white/5' 
                        : 'bg-black text-gray-200 rounded-bl-none border border-[#F5D48B]/30 shadow-[0_0_10px_rgba(245,212,139,0.1)]'
                    }`}>
                        <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.text}</p>
                    </div>
                </div>
            );
        })}
        {isGenerating && <div className="text-xs text-gray-500 ml-4 animate-pulse">Typing...</div>}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/90 border-t border-white/10">
        <div className="flex gap-2 items-center">
            <input 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-[#F5D48B]"
                disabled={isGenerating}
            />
            <button 
                onClick={handleSend}
                disabled={isGenerating || !inputValue}
                className="p-3 bg-[#F5D48B] rounded-full text-black hover:bg-[#eac06a] disabled:opacity-50 transition-colors"
            >
                <Icons.Send />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
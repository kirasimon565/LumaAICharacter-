import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { Button } from '../components/UI';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 pt-20 flex flex-col items-center animate-slide-up">
        <Icons.Logo className="w-56" />
        <p className="mt-4 text-gray-300 font-serif text-xl text-center max-w-xs">
          Craft your soul.<br/>Conversations that matter.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto space-y-4 mb-10 animate-fade-in" style={{animationDelay: '0.3s'}}>
        <Button onClick={() => navigate('/register')}>Create Account</Button>
        <Button variant="outline" onClick={() => navigate('/login')}>Sign In</Button>
        
        <div className="pt-4 text-center">
             <span className="text-xs text-gray-500 font-serif">Built with Love v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
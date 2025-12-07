import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '../../services/pocketbaseService';
import { Button, Input, LoadingSpinner } from '../../components/UI';
import { Icons } from '../../constants';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await pb.collection('users').authWithPassword(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center relative">
      <button onClick={() => navigate('/welcome')} className="absolute top-8 left-8 text-[#F5D48B]">
        <Icons.Back />
      </button>

      <div className="w-full max-w-md">
        <h2 className="text-3xl font-serif text-[#F5D48B] mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8">Enter the void.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Sign In'}
          </Button>
          
          <button type="button" className="w-full text-center text-sm text-gray-500 hover:text-[#F5D48B] mt-4">
            Forgot Password?
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
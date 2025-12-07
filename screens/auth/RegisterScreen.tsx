import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '../../services/pocketbaseService';
import { Button, Input, LoadingSpinner } from '../../components/UI';
import { Icons } from '../../constants';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = {
        email,
        password,
        passwordConfirm: confirmPassword,
        displayName: name,
        emailVisibility: true,
      };
      await pb.collection('users').create(data);
      await pb.collection('users').authWithPassword(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
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
        <h2 className="text-3xl font-serif text-[#F5D48B] mb-2 text-center">Join LumaAI</h2>
        <p className="text-gray-400 text-center mb-8">Begin your journey.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input label="Display Name" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
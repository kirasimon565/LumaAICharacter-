import React from 'react';
import { useApp } from '../App';
import { Button } from '../components/UI';
import { pb } from '../services/pocketbaseService';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    pb.authStore.clear();
    window.location.reload();
  };

  return (
    <div className="p-6">
       <h2 className="text-3xl font-serif text-[#F5D48B] mb-8">Identity</h2>
       
       <div className="flex items-center gap-6 mb-10">
         <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-[#F5D48B] flex items-center justify-center text-3xl font-serif text-white">
            {user?.displayName?.[0] || 'U'}
         </div>
         <div>
            <h3 className="text-xl text-white font-serif">{user?.displayName}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
         </div>
       </div>

       <div className="space-y-4">
          <div className="glass-panel p-4 rounded-lg flex justify-between items-center">
             <span className="text-gray-300">Account Type</span>
             <span className="text-[#F5D48B] font-serif">Standard</span>
          </div>
          <div className="glass-panel p-4 rounded-lg flex justify-between items-center">
             <span className="text-gray-300">Member Since</span>
             <span className="text-white">{new Date(user?.created || '').toLocaleDateString()}</span>
          </div>
       </div>

       <div className="mt-12">
          <Button variant="outline" onClick={handleLogout}>Log Out</Button>
       </div>
    </div>
  );
};

export default ProfileScreen;
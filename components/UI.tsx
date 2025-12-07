import React, { InputHTMLAttributes } from 'react';
import { Icons } from '../constants';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }> = ({ 
  className = "", 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  const baseStyle = "w-full py-3 px-6 rounded-lg font-serif tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#F5D48B] text-black hover:bg-[#eac06a] hover:shadow-[0_0_15px_rgba(245,212,139,0.4)]",
    outline: "border border-[#F5D48B] text-[#F5D48B] hover:bg-[#F5D48B]/10",
    ghost: "text-gray-400 hover:text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = "", ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-[#F5D48B] font-serif mb-2 text-sm">{label}</label>}
    <input 
      className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5D48B] transition-colors font-sans ${className}`}
      {...props}
    />
  </div>
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className = "", ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-[#F5D48B] font-serif mb-2 text-sm">{label}</label>}
    <textarea 
      className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5D48B] transition-colors font-sans min-h-[100px] ${className}`}
      {...props}
    />
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`glass-panel rounded-xl p-4 ${className}`}>
    {children}
  </div>
);

export const LoadingSpinner = () => (
  <div className="w-6 h-6 border-2 border-[#F5D48B] border-t-transparent rounded-full animate-spin"></div>
);

export const NavItem: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-full py-2 transition-colors duration-300 ${active ? 'text-[#F5D48B]' : 'text-gray-500 hover:text-gray-300'}`}>
    <Icon className={`w-6 h-6 mb-1 ${active ? 'drop-shadow-[0_0_5px_rgba(245,212,139,0.6)]' : ''}`} />
    <span className="text-[10px] font-sans tracking-wider">{label}</span>
  </button>
);
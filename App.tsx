
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { pb, api } from './services/pocketbaseService';
import { Icons, COLORS } from './constants';
import { User } from './types';
import { NavItem } from './components/UI';

// -- Screens --
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CreateCharacterScreen from './screens/CreateCharacterScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import DeveloperScreen from './screens/DeveloperScreen';
import CharacterPage from './screens/CharacterPage';

// -- Context --
interface AppContextType {
  user: User | null;
  refreshUser: () => void;
  isLoading: boolean;
}
const AppContext = createContext<AppContextType>({ user: null, refreshUser: () => {}, isLoading: true });
export const useApp = () => useContext(AppContext);

// -- Layout Component --
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/', icon: Icons.Home, label: 'Home' },
    { id: '/create', icon: Icons.Create, label: 'Create' },
    { id: '/chats', icon: Icons.Chat, label: 'Chats' },
    { id: '/profile', icon: Icons.Profile, label: 'Profile' },
    { id: '/settings', icon: Icons.Settings, label: 'Settings' },
    { id: '/dev', icon: Icons.Dev, label: 'Dev' },
  ];

  const hideNav = ['/login', '/register', '/welcome', '/splash', '/chat/'];
  const shouldHideNav = hideNav.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-white">
      {/* Background Glow Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F5D48B] rounded-full mix-blend-screen opacity-[0.03] blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#F5D48B] rounded-full mix-blend-screen opacity-[0.02] blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${!shouldHideNav ? 'pb-20' : ''}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {!shouldHideNav && (
        <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 z-50">
          <div className="flex justify-around items-center max-w-lg mx-auto">
            {navItems.map((item) => (
              <NavItem 
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.id}
                onClick={() => navigate(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// -- Main App --
const App = () => {
  const [user, setUser] = useState<User | null>(pb.authStore.model as User);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [splashOpacity, setSplashOpacity] = useState(1);

  useEffect(() => {
    // Auth Listener
    pb.authStore.onChange((token, model) => {
      setUser(model as User);
    });
    
    // Simulate initial loading and splash screen timing
    const loadSequence = async () => {
      // Refresh auth if possible
      if (pb.authStore.isValid) {
        try {
          await pb.collection('users').authRefresh();
        } catch {
          pb.authStore.clear();
        }
      }
      setIsLoading(false);

      // Splash screen fade out logic
      setTimeout(() => {
        setSplashOpacity(0);
        setTimeout(() => {
          setShowSplash(false);
        }, 1000); // Wait for fade out transition
      }, 2500); // Min display time
    };

    loadSequence();
  }, []);

  const refreshUser = async () => {
    if(pb.authStore.isValid) {
        await pb.collection('users').authRefresh();
    }
  };

  return (
    <AppContext.Provider value={{ user, refreshUser, isLoading }}>
      {showSplash && (
        <SplashScreen className={splashOpacity === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'} />
      )}
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/welcome" element={!user ? <WelcomeScreen /> : <Navigate to="/" />} />
            <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterScreen /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? <HomeScreen /> : <Navigate to="/welcome" />} />
            <Route path="/create" element={user ? <CreateCharacterScreen /> : <Navigate to="/welcome" />} />
            <Route path="/character/:id" element={user ? <CharacterPage /> : <Navigate to="/welcome" />} />
            <Route path="/chat/:id" element={user ? <ChatScreen /> : <Navigate to="/welcome" />} />
            <Route path="/chats" element={user ? <HomeScreen /> : <Navigate to="/welcome" />} />
            <Route path="/profile" element={user ? <ProfileScreen /> : <Navigate to="/welcome" />} />
            <Route path="/settings" element={user ? <SettingsScreen /> : <Navigate to="/welcome" />} />
            <Route path="/dev" element={user ? <DeveloperScreen /> : <Navigate to="/welcome" />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;

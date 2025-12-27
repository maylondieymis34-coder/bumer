
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { dbService } from './services/mockDatabase';
import { User, Connection } from './types';
import BoomerangLogo from './components/BoomerangLogo';

// Views
import SplashView from './views/SplashView';
import AuthView from './views/AuthView';
import RadarView from './views/RadarView';
import ChatListView from './views/ChatListView';
import ChatDetailView from './views/ChatDetailView';
import ProfileView from './views/ProfileView';

// Context
interface AuthContextType {
  user: User | null;
  refreshUser: () => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({ user: null, refreshUser: () => {}, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(dbService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check expirations on app start
    dbService.checkExpirations();
    
    // Simulate initial loading check
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const refreshUser = () => {
    setUser(dbService.getCurrentUser());
  };

  const logout = () => {
    dbService.logout();
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, refreshUser, logout }}>
      <Router>
        <Routes>
          <Route path="/splash" element={<SplashView />} />
          <Route path="/auth" element={user ? <Navigate to="/radar" /> : <AuthView />} />
          
          <Route path="/radar" element={user ? <RadarView /> : <Navigate to="/splash" />} />
          <Route path="/chats" element={user ? <ChatListView /> : <Navigate to="/splash" />} />
          <Route path="/chat/:id" element={user ? <ChatDetailView /> : <Navigate to="/splash" />} />
          <Route path="/profile" element={user ? <ProfileView /> : <Navigate to="/splash" />} />
          
          <Route path="/" element={<Navigate to="/splash" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

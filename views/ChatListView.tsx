
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/mockDatabase';
import { Connection, User } from '../types';
import Layout from '../components/Layout';
import { useAuth } from '../App';

const ChatListView: React.FC = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setConnections(dbService.getConnections());
    const interval = setInterval(() => {
      dbService.checkExpirations();
      setConnections(dbService.getConnections());
    }, 1000); // Update timers in real-time
    return () => clearInterval(interval);
  }, []);

  const getOtherUser = (c: Connection): User => {
    const id = c.user1Id === user?.id ? c.user2Id : c.user1Id;
    return dbService.getUser(id);
  };

  const getTimeLeft = (expiresAt: number) => {
    const diff = expiresAt - Date.now();
    if (diff <= 0) return 'Expirado';
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <Layout title="Mensagens">
      <div className="space-y-4">
        {connections.length === 0 && (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-5h-2v2h2V9z"/></svg>
            <p className="font-medium">Nenhuma conversa por aqui</p>
          </div>
        )}

        {connections.map(c => {
          const other = getOtherUser(c);
          const isVault = c.status === 'in_vault';

          return (
            <div
              key={c.id}
              onClick={() => navigate(`/chat/${c.id}`)}
              className={`flex items-center p-3 rounded-2xl transition-colors cursor-pointer ${isVault ? 'bg-gray-100 opacity-80' : 'bg-white shadow-sm border border-gray-100 hover:bg-gray-50'}`}
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${isVault ? 'border-red-400 grayscale opacity-60' : 'border-purple-200'}`}>
                  <img src={other.profilePhoto} className="w-full h-full object-cover" />
                </div>
                {isVault && (
                  <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    BAÚ
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="font-bold text-gray-900 truncate">{other.name}</h3>
                  <span className="text-[10px] text-gray-400">
                    {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                {isVault ? (
                  <div className="flex flex-col">
                     <p className="text-xs text-red-500 font-bold">Resgatar em: {getTimeLeft(c.vaultExpiresAt || 0)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 truncate">{c.lastMessage || 'Inicie a conversa...'}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default ChatListView;

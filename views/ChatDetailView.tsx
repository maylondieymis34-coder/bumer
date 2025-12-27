
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/mockDatabase';
import { Connection, User, Message } from '../types';
import { useAuth } from '../App';
import BoomerangLogo from '../components/BoomerangLogo';

const ChatDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conn, setConn] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showVaultPopup, setShowVaultPopup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const c = dbService.getConnections().find(x => x.id === id);
      if (c) {
        setConn(c);
        setMessages(dbService.getMessages(id));
      } else {
        navigate('/chats');
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const otherUser = conn ? dbService.getUser(conn.user1Id === user?.id ? conn.user2Id : conn.user1Id) : null;

  const handleSend = () => {
    if (!inputText.trim() || !id) return;
    dbService.sendMessage(id, inputText);
    setMessages(dbService.getMessages(id));
    setInputText('');
  };

  const handleVault = () => {
    if (!id) return;
    dbService.sendToVault(id);
    navigate('/chats');
  };

  const handleRescue = () => {
    if (!id) return;
    dbService.rescueFromVault(id);
    const updated = dbService.getConnections().find(x => x.id === id);
    if (updated) setConn(updated);
  };

  if (!conn || !otherUser) return null;

  const isVault = conn.status === 'in_vault';

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <header className="bg-white px-4 h-16 flex items-center border-b border-gray-100 z-10">
        <button onClick={() => navigate('/chats')} className="p-2 -ml-2 text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center flex-1 ml-2">
          <div className={`w-10 h-10 rounded-full overflow-hidden ${isVault ? 'grayscale opacity-60' : ''}`}>
            <img src={otherUser.profilePhoto} className="w-full h-full object-cover" />
          </div>
          <span className="ml-3 font-bold text-gray-800">{otherUser.name}</span>
        </div>
        {!isVault && (
          <button onClick={() => setShowVaultPopup(true)} className="p-2 text-purple-600 hover:scale-110 transition">
            <BoomerangLogo size={32} />
          </button>
        )}
      </header>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isVault ? 'bg-gray-50' : 'bg-gray-50/50'}`}>
        {isVault && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-red-100 flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-red-400 overflow-hidden">
               <img src={otherUser.profilePhoto} className="w-full h-full object-cover grayscale opacity-50" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Conexão no Baú</h2>
            <p className="text-sm text-gray-500 mb-6">Esta conexão será apagada permanentemente em breve.</p>
            <button
              onClick={handleRescue}
              className="w-full py-3 gradient-bumer text-white font-bold rounded-2xl shadow-md"
            >
              RESGATAR AGORA
            </button>
          </div>
        )}

        {messages.map(m => {
          const isMine = m.senderId === user?.id;
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium ${isMine ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'}`}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isVault && (
        <div className="p-4 bg-white border-t border-gray-100 pb-8">
          <div className="flex gap-2 items-center bg-gray-100 px-4 py-1 rounded-3xl">
            <input
              type="text"
              placeholder="Sua mensagem..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="p-2 text-purple-600 active:scale-90 transition">
              <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Vault Popup */}
      {showVaultPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-xs text-center animate-in zoom-in duration-300">
            <div className="mb-4 flex justify-center">
              <BoomerangLogo size={60} />
            </div>
            <h3 className="text-xl font-bold mb-2">Enviar pro Baú?</h3>
            <p className="text-gray-500 text-sm mb-8 px-2">A conexão ficará inativa e será deletada permanentemente após 5 dias se não for resgatada.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleVault} className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200">
                SIM, ENVIAR
              </button>
              <button onClick={() => setShowVaultPopup(false)} className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl">
                AGORA NÃO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDetailView;

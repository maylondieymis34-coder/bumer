
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
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center flex-1 ml-2">
          <div className={`w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 ${isVault ? 'grayscale opacity-60' : ''}`}>
            <img src={otherUser.profilePhoto} className="w-full h-full object-cover" />
          </div>
          <span className="ml-3 font-black text-gray-800 tracking-tight">{otherUser.name}</span>
        </div>
        {!isVault && (
          <button onClick={() => setShowVaultPopup(true)} className="p-2 hover:scale-110 transition active:rotate-12">
            <BoomerangLogo size={32} />
          </button>
        )}
      </header>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isVault ? 'bg-gray-50' : 'bg-gray-50/30'}`}>
        {isVault && (
          <div className="bg-white p-6 rounded-[32px] shadow-lg border-2 border-red-50 flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-4 border-red-500 overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.5)]">
               <img src={otherUser.profilePhoto} className="w-full h-full object-cover grayscale opacity-50" />
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-2">Conexão no Baú</h2>
            <p className="text-xs font-medium text-gray-400 mb-6 uppercase tracking-wider">Será apagada permanentemente em 5 dias</p>
            <button
              onClick={handleRescue}
              className="w-full py-4 gradient-bumer text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-sm"
            >
              RESGATAR AGORA
            </button>
          </div>
        )}

        {messages.map(m => {
          const isMine = m.senderId === user?.id;
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-[20px] text-sm font-semibold shadow-sm ${isMine ? 'bg-[#FF00E5] text-white rounded-br-none neon-shadow' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isVault && (
        <div className="p-4 bg-white border-t border-gray-50 pb-8">
          <div className="flex gap-2 items-center bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
            <input
              type="text"
              placeholder="Sua mensagem..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 font-medium"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="p-2 text-[#00FBFF] active:scale-90 transition">
              <svg className="w-6 h-6 transform rotate-45" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Vault Popup */}
      {showVaultPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xs text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="mb-6 flex justify-center">
              <BoomerangLogo size={70} />
            </div>
            <h3 className="text-2xl font-black mb-3 text-gray-900 tracking-tight">ENVIAR PRO BAÚ?</h3>
            <p className="text-gray-400 text-xs font-bold mb-10 px-2 uppercase tracking-wide">A conexão será deletada em 5 dias.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleVault} className="w-full py-4 bg-black text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs border-2 border-white">
                SIM, ENVIAR
              </button>
              <button onClick={() => setShowVaultPopup(false)} className="w-full py-4 bg-gray-100 text-gray-500 font-black rounded-2xl uppercase tracking-widest text-xs">
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

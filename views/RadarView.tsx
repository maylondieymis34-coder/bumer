
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/mockDatabase';
import { User } from '../types';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const RadarView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setUsers(dbService.getRadarUsers());
  }, []);

  const handleConnect = (otherUser: User) => {
    const conn = dbService.createConnection(otherUser.id);
    if (conn) {
      navigate(`/chat/${conn.id}`);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4 pb-8">
        {users.map(u => (
          <div key={u.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group active:scale-95 transition-transform duration-200">
            <div className="h-44 relative overflow-hidden">
              <img src={u.profilePhoto} className="w-full h-full object-cover" alt={u.name} />
            </div>
            <div className="p-3 flex flex-col items-center bg-white">
              <div className="flex gap-1 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#39FF14] shadow-[0_0_5px_#39FF14]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFF01F] shadow-[0_0_5px_#FFF01F]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#00FBFF] shadow-[0_0_5px_#00FBFF]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF00E5] shadow-[0_0_5px_#FF00E5]" />
              </div>
              <span className="font-bold text-gray-800 text-base">{u.name}</span>
              <button
                onClick={() => handleConnect(u)}
                className="mt-3 w-full py-2.5 bg-black text-[#00FBFF] font-black text-xs rounded-2xl hover:text-white hover:bg-black transition shadow-sm border-2 border-[#00FBFF] uppercase tracking-tighter"
              >
                Puxar o Bumer
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default RadarView;

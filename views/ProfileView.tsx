
import React from 'react';
import { useAuth } from '../App';
import Layout from '../components/Layout';
import { dbService } from '../services/mockDatabase';

const ProfileView: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dbService.updateProfilePhoto(user.id, reader.result as string);
        refreshUser();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <Layout title="Meu Perfil">
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-72 h-96 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white mb-8">
            <img src={user.profilePhoto} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <label className="absolute bottom-4 right-[-10px] w-14 h-14 gradient-bumer text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 active:scale-90 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
          </label>
        </div>

        <div className="w-full space-y-4 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{user.name}, {user.age}</h2>
            <p className="text-gray-500 mt-1">{user.email}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Bio</h3>
            <p className="text-gray-700 leading-relaxed">{user.bio || 'Sem bio informada.'}</p>
          </div>

          <button
            onClick={logout}
            className="w-full py-4 mt-8 bg-gray-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition"
          >
            SAIR DA CONTA
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileView;


import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import BoomerangLogo from './BoomerangLogo';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto shadow-2xl relative">
      <header className="bg-white px-6 pt-4 pb-4 sticky top-0 z-20 flex flex-col items-center border-b border-gray-50">
        <div className="flex flex-col items-center justify-center">
          {title ? (
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          ) : (
             <div className="flex flex-col items-center">
                <BoomerangLogo size={36} />
                <span className="mt-1 font-black text-lg tracking-normal text-black">BUMER</span>
             </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-28">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-gray-100 h-20 flex justify-around items-center px-4 z-30">
        <NavLink to="/radar" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#FF00E5] scale-110' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-[10px] font-black uppercase tracking-wider">Radar</span>
        </NavLink>
        <NavLink to="/chats" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#00FBFF] scale-110' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="text-[10px] font-black uppercase tracking-wider">Chats</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#B026FF] scale-110' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" /></svg>
          <span className="text-[10px] font-black uppercase tracking-wider">Perfil</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;

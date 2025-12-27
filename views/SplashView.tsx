
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BoomerangLogo from '../components/BoomerangLogo';

const SplashView: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <div className="animate-bounce">
        <BoomerangLogo size={120} showText={true} />
      </div>
    </div>
  );
};

export default SplashView;

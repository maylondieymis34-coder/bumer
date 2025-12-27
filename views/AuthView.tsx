
import React, { useState } from 'react';
import { dbService } from '../services/mockDatabase';
import { useAuth } from '../App';
import BoomerangLogo from '../components/BoomerangLogo';

const AuthView: React.FC = () => {
  const { refreshUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    bio: '',
    profilePhoto: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (isLogin) {
      const user = dbService.login(formData.email);
      if (user) {
        refreshUser();
      } else {
        alert('Usuário não encontrado. Use o cadastro.');
      }
    } else {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        age: 20, // Should calculate from birthDate
        profilePhoto: formData.profilePhoto || `https://ui-avatars.com/api/?name=${formData.name}&background=random&size=512`
      };
      dbService.register(newUser);
      refreshUser();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="mb-8 flex justify-center">
        <BoomerangLogo size={80} />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        {isLogin ? 'Bem-vindo de volta' : `Cadastro - Passo ${step}`}
      </h1>

      <div className="flex-1 space-y-4">
        {isLogin ? (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 bg-gray-100 rounded-2xl border-none focus:ring-2 ring-purple-500"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-4 bg-gray-100 rounded-2xl border-none focus:ring-2 ring-purple-500"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </>
        ) : (
          <>
            {step === 1 && (
              <>
                <input
                  placeholder="Nome completo"
                  className="w-full p-4 bg-gray-100 rounded-2xl"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  placeholder="Email"
                  className="w-full p-4 bg-gray-100 rounded-2xl"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className="w-full p-4 bg-gray-100 rounded-2xl"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </>
            )}
            {step === 2 && (
              <>
                <input
                  type="date"
                  placeholder="Data de Nascimento"
                  className="w-full p-4 bg-gray-100 rounded-2xl"
                  value={formData.birthDate}
                  onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                />
                <textarea
                  placeholder="Sua bio"
                  rows={4}
                  className="w-full p-4 bg-gray-100 rounded-2xl"
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                />
              </>
            )}
            {step === 3 && (
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden mb-4 border-4 border-dashed border-gray-400 flex items-center justify-center">
                  {formData.profilePhoto ? (
                    <img src={formData.profilePhoto} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500 text-center px-4">Sua foto aparecerá aqui</span>
                  )}
                </div>
                <label className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold cursor-pointer hover:bg-purple-700 transition">
                  Selecionar Foto
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {isLogin ? (
          <button
            onClick={handleSubmit}
            className="w-full py-4 gradient-bumer text-white font-bold rounded-2xl shadow-lg"
          >
            ENTRAR
          </button>
        ) : (
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl"
              >
                VOLTAR
              </button>
            )}
            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              className="flex-[2] py-4 gradient-bumer text-white font-bold rounded-2xl shadow-lg"
            >
              {step === 3 ? 'FINALIZAR' : 'PRÓXIMO'}
            </button>
          </div>
        )}

        <button
          onClick={() => { setIsLogin(!isLogin); setStep(1); }}
          className="text-gray-500 font-medium"
        >
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
        </button>
      </div>
    </div>
  );
};

export default AuthView;

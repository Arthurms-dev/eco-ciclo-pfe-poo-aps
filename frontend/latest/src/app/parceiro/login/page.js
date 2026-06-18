'use client';
import { Store, Eye, EyeOff, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import api from '../../../services/api';

export default function ParceiroLoginPage() {
  const router = useRouter();
  const loginGlobal = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); setErro(''); setCarregando(true);

    try {
      const response = await api.post('/usuarios/login', { email, senha });
      const { user, token } = response.data;
      
      loginGlobal(user, token);
      router.push('/parceiro');
    } catch (err) {
      setErro('Acesso negado. Credenciais corporativas inválidas.'); 
    } finally { 
      setCarregando(false); 
    }
  };


  const preencherDadosTeste = () => {
    setEmail('admin@ecoponto.com');
    setSenha('123456');
  };

  return (
    <div className="min-h-screen bg-[#111815] flex items-center justify-center p-6 text-white relative overflow-hidden selection:bg-[#7d9b76]">
      
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#7d9b76]/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-[#1a2421]/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10">
        
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 shadow-lg">
            <Store className="h-8 w-8 text-[#7d9b76]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Acesso <span className="text-[#7d9b76]">Parceiros</span>
          </h1>
          <p className="text-sm font-medium text-white/40 mt-2 text-center">
            Sistema de Gestão de Ecopontos e Logística Reversa
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-white/50">E-mail Corporativo</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-[#111815] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm text-white transition-all placeholder:text-white/20"
              placeholder="operacao@ecoponto.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-white/50">Senha de Acesso</label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"} required value={senha} onChange={(e) => setSenha(e.target.value)}
                className="w-full px-5 py-3.5 bg-[#111815] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm text-white pr-12 transition-all placeholder:text-white/20"
                placeholder="••••••••"
              />
              <button
                type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#7d9b76] transition-colors"
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4 text-red-400" />
              <p className="text-red-400 text-xs font-bold">{erro}</p>
            </div>
          )}

          <button
            type="submit" disabled={carregando}
            className="w-full flex items-center justify-center gap-2 bg-[#7d9b76] hover:bg-[#6c8866] text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg mt-4 cursor-pointer"
          >
            {carregando ? 'A Autenticar...' : 'Aceder ao Sistema'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center">
          <button 
            onClick={preencherDadosTeste} type="button"
            className="text-[11px] font-bold text-white/30 hover:text-white/70 transition-colors flex items-center gap-1.5"
          >
            <MapPin size={12} /> Preencher credenciais de demonstração
          </button>
        </div>
      </div>
    </div>
  );
}
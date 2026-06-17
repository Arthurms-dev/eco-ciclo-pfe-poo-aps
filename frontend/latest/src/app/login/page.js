'use client';
import { Eye, EyeOff, Leaf, ArrowRight, Store } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import Link from 'next/link';
import api from '../services/api'; 

export default function LoginPage() {
  const router = useRouter();
  const loginGlobal = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erroShake, setErroShake] = useState(false);

  const dispararTremor = () => {
    setErroShake(true); setTimeout(() => setErroShake(false), 400);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setErro(''); setCarregando(true);

    try {
      const response = await api.post('/usuarios/login', { email, senha });
      
      const { user, token } = response.data;
      
      loginGlobal(user, token);
      router.push('/profile');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'E-mail ou senha incorretos.'); 
      dispararTremor(); 
    } finally { 
      setCarregando(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-6 text-[#1a2421] relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#7d9b76]/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className={`w-full max-w-md bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-2xl transition-all duration-300 relative z-10 ${
        erroShake ? 'animate-shake border-red-400 shadow-red-500/20' : 'shadow-[#7d9b76]/10'
      }`}>
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#7d9b76] to-[#5a7654] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#7d9b76]/30">
            <Leaf className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black font-heading tracking-tight text-[#1a2421]">Bem-vindo de volta</h1>
          <p className="text-sm font-medium text-[#1a2421]/50 mt-1">Insira as credenciais para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-[#1a2421]/60">E-mail</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-white border border-[#a8c0a0]/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76]/50 focus:border-[#7d9b76] text-sm transition-all"
              placeholder="exemplo@email.com"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-[#1a2421]/60">Senha</label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"} required value={senha} onChange={(e) => setSenha(e.target.value)}
                className="w-full px-5 py-3.5 bg-white border border-[#a8c0a0]/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76]/50 focus:border-[#7d9b76] text-sm pr-12 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a2421]/40 hover:text-[#7d9b76] transition-colors"
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {erro && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-xl border border-red-100">{erro}</p>}

          <button
            type="submit" disabled={carregando}
            className="w-full flex items-center justify-center gap-2 bg-[#1a2421] hover:bg-[#2d3a35] text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-50 hover:scale-[1.02] shadow-lg mt-2 cursor-pointer"
          >
            {carregando ? 'A aceder...' : 'Entrar na Plataforma'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-sm text-[#1a2421]/60 mt-8 font-medium">
          Ainda não faz parte?{' '}
          <Link href="/register" className="text-[#7d9b76] font-black hover:underline hover:text-[#5a7654] transition-colors">
            Criar conta
          </Link>
        </p>
        
    <div className="mt-8 pt-6 border-t border-[#a8c0a0]/20 text-center">
  <Link href="/parceiro/login" className="text-[11px] font-bold text-[#1a2421]/40 hover:text-[#7d9b76] flex items-center justify-center gap-1 transition-colors uppercase tracking-widest">
    <Store size={12} /> Acesso Corporativo (Ecopontos)
  </Link>
</div>
      </div>
    </div>
  );
}
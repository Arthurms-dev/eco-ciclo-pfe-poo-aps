'use client';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import Link from 'next/link';

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
    setErroShake(true);
    setTimeout(() => setErroShake(false), 400);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    const API_URL = 'https://eco-ciclo-pfe-poo-aps-backend.onrender.com';

    try {
        const response = await fetch(`${API_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const dadosUsuario = await response.json();
        loginGlobal(dadosUsuario);
        router.push('/profile');
      } else {
        setErro('E-mail ou senha incorretos.');
        dispararTremor(); 
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setErro('Não foi possível conectar ao servidor.');
      dispararTremor(); 
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-6 text-[#1a2421]">

      <div className={`w-full max-w-md bg-white p-8 rounded-3xl border shadow-sm transition-all duration-300 ${
        erroShake 
          ? 'animate-shake border-red-400 shadow-md shadow-red-100/50' 
          : 'border-[#a8c0a0]/20'
      }`}>

        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-[#7d9b76] text-[#f5f0e8] flex items-center justify-center mb-3">
            <Leaf className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Entrar no EcoCiclo</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f5f0e8]/30 border border-[#a8c0a0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Senha</label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f5f0e8]/30 border border-[#a8c0a0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7d9b76] transition-colors"
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {erro && <p className="text-red-500 text-xs font-medium">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#7d9b76] hover:bg-[#6c8866] text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-[#7d9b76] font-bold hover:underline">
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
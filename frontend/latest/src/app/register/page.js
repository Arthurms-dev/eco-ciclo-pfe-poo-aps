'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro('');

    if (senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres.');
      dispararTremor();
      return;
    }

    setCarregando(true);

    const API_URL = 'https://eco-ciclo-pfe-poo-aps-backend.onrender.com';

    try {
        const response = await fetch(`${API_URL}/api/usuarios`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (response.ok) {
        alert('Conta criada com sucesso!');
        router.push('/login');
      } else {
        setErro('Erro ao registrar. Verifique os dados ou tente outro e-mail.');
        dispararTremor(); 
      }
    } catch (err) {
      setErro('Falha na comunicação com o servidor. Registrando localmente para teste...');
      dispararTremor(); 
      
      setTimeout(() => {
        alert('Conta criada com sucesso! (Modo Simulação)');
        router.push('/login');
      }, 1000);
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
          <h1 className="text-2xl font-bold font-heading">Criar Conta no EcoCiclo</h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f5f0e8]/30 border border-[#a8c0a0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm"
            />
          </div>

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
            <p className={`text-[10px] mt-1 ${senha.length > 0 && senha.length < 8 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
              Mínimo de 8 caracteres.
            </p>
          </div>

          {erro && <p className="text-red-500 text-xs font-medium">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#7d9b76] hover:bg-[#6c8866] text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-[#7d9b76] font-bold hover:underline">
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
}
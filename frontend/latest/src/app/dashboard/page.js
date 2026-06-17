'use client';
import useSWR from 'swr';
import api from '../../services/api';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore';
import { Flame, Award, Recycle, Box, AlertTriangle, ArrowRight, Clock } from 'lucide-react';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function DashboardPage() {
  const usuarioLogado = useAuthStore((state) => state.user);

  const { data: residuos = [], isLoading } = useSWR('/residuos', fetcher);

  const totalItens = residuos?.length || 0;
  const pesoTotal = residuos?.reduce((acc, item) => acc + (item.pesoEstimado || 0), 0) || 0;
  const itensPerigosos = residuos?.filter(item => item.isPerigoso).length || 0;

  const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return "EcoReciclador";
    const primeiroNome = nomeCompleto.split(" ")[0].toLowerCase();
    return primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1);
  };

  if (!usuarioLogado) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="h-8 w-8 border-4 border-[#7d9b76] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-gray-900 p-6 md:p-10 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a2421] tracking-tight">Olá, {getPrimeiroNome(usuarioLogado.nome)}! 👋</h1>
        <p className="text-[#1a2421]/60 mt-2 font-medium">Bem-vindo ao seu painel de controle logístico e de impacto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-[2rem] border border-orange-200 shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform">
          <div>
            <p className="text-xs font-black text-orange-600/70 uppercase tracking-widest mb-1">Sua Ofensiva</p>
            <h3 className="text-3xl font-black text-orange-600">{usuarioLogado.streak || 0} <span className="text-lg">Dias</span></h3>
          </div>
          <Flame className="h-10 w-10 text-orange-500 fill-current animate-pulse" />
        </div>

        <div className="bg-gradient-to-br from-[#f5f0e8] to-[#dce5d4] p-6 rounded-[2rem] border border-[#a8c0a0]/40 shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-black text-[#7d9b76] uppercase tracking-widest mb-1">Saldo na Carteira</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-[#1a2421]">{usuarioLogado.totalPontos || 0} <span className="text-lg text-[#7d9b76]">ECO</span></h3>
            </div>
            {usuarioLogado.pontosPendentes > 0 && (
              <p className="text-xs font-bold text-amber-600 mt-2 flex items-center gap-1 bg-amber-100/50 px-2 py-1 rounded-lg w-fit">
                <Clock size={12} /> +{usuarioLogado.pontosPendentes} pendentes
              </p>
            )}
          </div>
          <Award className="h-10 w-10 text-[#7d9b76] relative z-10 opacity-80" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/40 rounded-full blur-xl z-0"></div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-[2rem] border border-green-200 shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform">
          <div>
            <p className="text-xs font-black text-green-700/70 uppercase tracking-widest mb-1">Volume Desviado</p>
            <h3 className="text-3xl font-black text-green-700">{usuarioLogado.totalResiduosKg || pesoTotal.toFixed(1)} <span className="text-lg">kg</span></h3>
          </div>
          <Recycle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-[#a8c0a0]/30">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Box className="text-[#7d9b76] h-5 w-5" /> Resumo do Inventário</h2>
          {isLoading ? (
            <p className="text-[#1a2421]/40 animate-pulse text-sm font-medium">Lendo sensores do sistema...</p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#f5f0e8]/50 p-4 rounded-xl border border-[#a8c0a0]/20">
                <span className="text-sm font-bold text-[#1a2421]/70">Total de resíduos mapeados:</span>
                <span className="font-black text-lg text-[#1a2421]">{totalItens} itens</span>
              </div>
              <div className="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-100">
                <span className="text-sm font-bold text-red-700/70 flex items-center gap-2"><AlertTriangle size={16} /> Contendo materiais tóxicos:</span>
                <span className="font-black text-lg text-red-600">{itensPerigosos} itens</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-[#a8c0a0]/30 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">Painel de Ações</h2>
            <p className="text-sm text-[#1a2421]/60 font-medium mb-6">Controle os seus inventários ou inicie uma nova logística reversa.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <Link href="/residuos" className="flex flex-col items-center justify-center gap-2 bg-[#f5f0e8] hover:bg-[#dce5d4] text-[#7d9b76] py-4 rounded-2xl font-bold transition-colors text-sm border border-[#a8c0a0]/30">
              <Box size={20} /> Meu Inventário
            </Link>
            <Link href="/form" className="flex flex-col items-center justify-center gap-2 bg-[#7d9b76] hover:bg-[#6c8866] hover:-translate-y-1 text-white py-4 rounded-2xl font-bold transition-all text-sm shadow-lg shadow-[#7d9b76]/20">
              <ArrowRight size={20} /> Agendar Descarte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useQuery } from '@tanstack/react-query';
import { wasteService } from '../../services/wasteService';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore';

export default function DashboardPage() {
  
  const usuarioLogado = useAuthStore((state) => state.user);

  const { data: residuos, isLoading } = useQuery({
    queryKey: ['wasteItems'],
    queryFn: wasteService.listar
  });

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
        Carregando painel...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-gray-900 dark:text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-600">Olá, {getPrimeiroNome(usuarioLogado.nome)}! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">Bem-vindo ao seu painel de controle de logística reversa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
        <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-xl border border-orange-200 dark:border-orange-900 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-sm font-medium text-orange-700 dark:text-orange-400 uppercase tracking-wider">Sua Ofensiva</p>
            <h3 className="text-3xl font-bold text-orange-600">{usuarioLogado.streak || 0} Dias</h3>
          </div>
          <span className="text-4xl animate-pulse">🔥</span>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-900 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">Saldo de Pontos</p>
            <h3 className="text-3xl font-bold text-yellow-600">{usuarioLogado.totalPontos || 0} ECO</h3>
          </div>
          <span className="text-4xl">🪙</span>
        </div>

        <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-xl border border-green-200 dark:border-green-900 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400 uppercase tracking-wider">Total Descartado</p>
            <h3 className="text-3xl font-bold text-green-600">{usuarioLogado.totalResiduosKg || pesoTotal.toFixed(1)} kg</h3>
          </div>
          <span className="text-4xl">🌱</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Resumo do Inventário</h2>
          {isLoading ? (
            <p className="text-gray-500 animate-pulse">Calculando métricas...</p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total de resíduos listados:</span>
                <span className="font-semibold">{totalItens} itens</span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Itens perigosos / tóxicos:</span>
                <span className="font-semibold text-red-500">{itensPerigosos} itens</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Ações Rápidas</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Gerencie os seus resíduos ou programe coletas de forma rápida.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/residuos" className="bg-green-600 hover:bg-green-700 text-white text-center py-2.5 rounded-lg font-medium transition text-sm shadow-sm">
              Meu Inventário
            </Link>
            <Link href="/form" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-center py-2.5 rounded-lg font-medium transition text-sm">
              Agendar Coleta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { Store, CheckCircle, Clock, MapPin, Box, ArrowRightCircle, Search } from 'lucide-react';
import useSWR from 'swr';
import api from '../../services/api';
import { toast } from 'sonner';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function PortalParceiroPage() {
  const { data: agendamentosPendentes = [], mutate, isLoading } = useSWR(`/agendamentos/pendentes`, fetcher, { refreshInterval: 5000 });
  
  const [carregandoAcao, setCarregandoAcao] = useState(null);
  const [busca, setBusca] = useState('');

  const getNomeResiduo = (id) => {
    switch(String(id)) {
      case '1': return "Óleo Usado (L)";
      case '2': return "Baterias (kg)";
      case '3': return "Eletrônicos (kg)";
      case '4': return "Papel/Vidro/Metal (kg)";
      default: return "Resíduo";
    }
  };

  const handleConfirmarRecebimento = async (idAgendamento, nomeUsuario) => {
    if (!confirm(`Confirmar o recebimento dos materiais de ${nomeUsuario}? Os pontos serão libertados para o cidadão.`)) return;
    
    setCarregandoAcao(idAgendamento);
    try {
      await api.put(`/agendamentos/${idAgendamento}/concluir`);
      toast.success("Recebimento confirmado! Pontos transferidos com sucesso.");
      mutate();
    } catch (err) {
      toast.error("Erro ao processar o recebimento no sistema.");
    } finally {
      setCarregandoAcao(null);
    }
  };

  const pendentesFiltrados = agendamentosPendentes.filter(ag => {
    const nome = ag.user?.nome || ag.userId || "Cidadão Eco";
    return String(nome).toLowerCase().includes(busca.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#1a2421] text-white p-6 md:p-10 font-sans selection:bg-[#7d9b76]">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-[#7d9b76] rounded-2xl flex items-center justify-center shadow-lg shadow-[#7d9b76]/20">
              <Store className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Portal do Parceiro ECO</h1>
              <p className="text-white/50 text-sm font-medium mt-1 flex items-center gap-2">
                <MapPin size={14} /> Recebimento de Cargas (B2B)
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-white/80">Sistema Online</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-2">Aguardando Recebimento</p>
            <h3 className="text-4xl font-black text-amber-400">{agendamentosPendentes.length}</h3>
          </div>
          <div className="md:col-span-2 bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col justify-center">
            <label className="text-white/40 text-xs font-black uppercase tracking-widest mb-3 block">Pesquisar Cidadão na Fila</label>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/30" />
              <input 
                type="text" 
                placeholder="Digite o nome de quem chegou..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-[#111815] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#7d9b76] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="text-amber-400" size={20} /> Entregas Agendadas ({pendentesFiltrados.length})
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <p className="text-white/40 text-center py-10 animate-pulse">A sincronizar com a base de dados...</p>
            ) : pendentesFiltrados.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <CheckCircle className="h-10 w-10 mx-auto text-white/20 mb-3" />
                <p className="text-white/50 font-medium">Nenhum agendamento encontrado para hoje.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendentesFiltrados.map((ag) => {
                  const dataAgendada = new Date(ag.dataHora);
                  const nomeCidadao = ag.user?.nome || ag.userId || "Cidadão Eco";
                  const idResiduoReal = ag.wasteId || ag.wasteItem?.id;

                  return (
                    <div key={ag.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-[#2a3631] border border-[#3a4a44] hover:border-[#7d9b76] transition-colors group">
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:text-amber-400 transition-colors">
                          <Box size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{nomeCidadao}</h4>
                          <p className="text-xs text-white/50 flex items-center gap-1.5 mt-1">
                            <Clock size={12} /> {dataAgendada.toLocaleDateString('pt-BR')} às {dataAgendada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
                        <div className="bg-[#1a2421] px-4 py-2 rounded-xl border border-white/5 w-full md:w-auto">
                          <span className="block text-[10px] text-white/40 uppercase tracking-wider font-bold mb-0.5">Carga Declarada</span>
                          <span className="font-bold text-[#7d9b76]">{ag.quantidade} {getNomeResiduo(idResiduoReal)}</span>
                        </div>

                        <button 
                          onClick={() => handleConfirmarRecebimento(ag.id, nomeCidadao)}
                          disabled={carregandoAcao === ag.id}
                          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#7d9b76] hover:bg-[#6c8866] text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                        >
                          {carregandoAcao === ag.id ? 'A processar...' : 'Confirmar Recebimento'} <ArrowRightCircle size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
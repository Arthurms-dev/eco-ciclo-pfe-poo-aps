'use client';
import * as React from "react";
import { useState, useEffect } from "react";
import { User, Mail, Flame, Recycle, Award, MapPin, CalendarClock, Clock, Trash2, CheckCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore"; 
import useSWR from 'swr';
import api from '../../services/api';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function PerfilPage() {
  const usuarioLogado = useAuthStore((state) => state.user);
  const atualizarSessaoLocal = useAuthStore((state) => state.setUser || state.login); 

  const [editando, setEditando] = useState(false);
  const [nomeForm, setNomeForm] = useState("");
  const [cidadeForm, setCidadeForm] = useState("Recife - PE");
  const [telefoneForm, setTelefoneForm] = useState("");

  const { data: todosAgendamentos = [], mutate } = useSWR(`/agendamentos`, fetcher, { refreshInterval: 3000 });

  const agendamentos = todosAgendamentos.filter(ag => {
    const idDonoDoAgendamento = ag.userId || ag.user?.id;
    return usuarioLogado && String(idDonoDoAgendamento) === String(usuarioLogado.id);
  });

  const formatarNome = (txt) => {
    if (!txt) return "";
    return txt.toLowerCase().split(" ").map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1)).join(" ");
  };

  const getIniciais = (nome) => {
    if (!nome) return "EC";
    const partes = nome.split(" ");
    if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
    return nome.substring(0, 2).toUpperCase();
  };

  const getNivelUsuario = (pontos = 0) => {
    if (pontos < 500) return { titulo: "Semente Eco", icone: "🌱", cor: "bg-[#dce5d4] text-[#5a7654] border-[#a8c0a0]" };
    if (pontos < 1500) return { titulo: "Broto Ativo", icone: "🌿", cor: "bg-green-100 text-green-700 border-green-300" };
    if (pontos < 5000) return { titulo: "Árvore Guardiã", icone: "🌳", cor: "bg-emerald-100 text-emerald-700 border-emerald-300" };
    return { titulo: "Herói da Natureza", icone: "🌍", cor: "bg-amber-100 text-amber-700 border-amber-300" };
  };

  useEffect(() => {
    if (usuarioLogado) {
      setNomeForm(formatarNome(usuarioLogado.nome) || "");
      setTelefoneForm(usuarioLogado.telefone || "");
    }
  }, [usuarioLogado]);

  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#7d9b76] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const nivelAtual = getNivelUsuario(usuarioLogado.totalPontos);

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    const usuarioAtualizado = { ...usuarioLogado, nome: formatarNome(nomeForm), telefone: telefoneForm };
    try {
      const response = await api.put(`/usuarios/${usuarioLogado.id}`, usuarioAtualizado);
      atualizarSessaoLocal({ ...response.data, nome: formatarNome(response.data.nome) });
      toast.success("Informações atualizadas!");
      setEditando(false);
    } catch (err) {
      toast.error("Erro ao salvar alterações no servidor.");
    }
  };

  const getNomeResiduo = (id) => {
    switch(String(id)) {
      case '1': return "Óleo de Cozinha Usado";
      case '2': return "Baterias Velhas";
      case '3': return "Resíduos Eletrônicos";
      case '4': return "Papel, Vidro ou Metal";
      default: return "Resíduo a classificar";
    }
  };

  const handleCancelarAgendamento = async (idAgendamento) => {
    if (!confirm("Tem a certeza que deseja cancelar este descarte?")) return;
    try {
      await api.delete(`/agendamentos/${idAgendamento}`);
      toast.success("Agendamento cancelado!");
      const userAtualizado = await api.get(`/usuarios/${usuarioLogado.id}`);
      atualizarSessaoLocal(userAtualizado.data);
      mutate();
    } catch (error) { toast.error("Erro ao cancelar."); }
  };

  const handleSimularEntrega = async (idAgendamento) => {
    try {
      await api.put(`/agendamentos/${idAgendamento}/concluir`);
      toast.success("Entrega confirmada pelo Ecoponto! Pontos libertados com sucesso.");
      const userAtualizado = await api.get(`/usuarios/${usuarioLogado.id}`);
      atualizarSessaoLocal(userAtualizado.data);
      mutate();
    } catch (err) { toast.error("Erro ao confirmar entrega."); }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f5f0e8] p-6 md:p-10 font-sans text-[#1a2421]">
      
      <div className="max-w-5xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-700 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#7d9b76] to-[#a8c0a0] flex items-center justify-center shadow-lg text-white text-3xl font-black border-4 border-white">
          {getIniciais(usuarioLogado.nome)}
        </div>
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-2 border ${nivelAtual.cor}`}>
            {nivelAtual.icone} Nível: {nivelAtual.titulo}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-[#1a2421] tracking-tight">
            Olá, {formatarNome(usuarioLogado.nome).split(' ')[0]}!
          </h1>
          <p className="text-sm font-medium text-[#1a2421]/50 mt-1">Gira os seus dados e acompanhe o seu impacto ambiental.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          <div className="bg-white/80 backdrop-blur-md border border-[#a8c0a0]/30 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 pb-3 border-b border-[#a8c0a0]/20">
              <User className="h-5 w-5 text-[#7d9b76]" /> Configurações de Conta
            </h2>

            <form onSubmit={handleSalvarPerfil} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-[#1a2421]/50 uppercase tracking-widest mb-2">Nome Completo</label>
                  <input type="text" value={nomeForm} disabled={!editando} onChange={(e) => setNomeForm(e.target.value)} className="w-full px-4 py-3 bg-[#f5f0e8]/50 border border-[#a8c0a0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm text-[#1a2421] font-medium disabled:opacity-60 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1a2421]/50 uppercase tracking-widest mb-2">E-mail (Chave Primária)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-[#1a2421]/40" />
                    <input type="email" value={usuarioLogado.email || "não informado"} disabled className="w-full pl-11 pr-4 py-3 bg-[#f5f0e8]/30 border border-gray-200 rounded-xl text-sm text-[#1a2421]/40 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-[#1a2421]/50 uppercase tracking-widest mb-2">WhatsApp / Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-4 w-4 text-[#7d9b76]" />
                    <input type="text" placeholder="(81) 90000-0000" value={telefoneForm} disabled={!editando} onChange={(e) => setTelefoneForm(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[#f5f0e8]/50 border border-[#a8c0a0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm text-[#1a2421] font-medium disabled:opacity-60 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1a2421]/50 uppercase tracking-widest mb-2">Localidade Base</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-[#7d9b76]" />
                    <input type="text" value={cidadeForm} disabled={!editando} onChange={(e) => setCidadeForm(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[#f5f0e8]/50 border border-[#a8c0a0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm text-[#1a2421] font-medium disabled:opacity-60 transition-all" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#a8c0a0]/10 mt-6">
                {editando ? (
                  <>
                    <button type="button" onClick={() => { setEditando(false); setNomeForm(formatarNome(usuarioLogado.nome) || ""); setTelefoneForm(usuarioLogado.telefone || ""); }} className="px-6 py-2.5 rounded-xl text-xs font-bold border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors">Cancelar</button>
                    <button type="submit" className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#7d9b76] text-white shadow-md hover:bg-[#6c8866] hover:-translate-y-0.5 transition-all">Salvar Alterações</button>
                  </>
                ) : (
                  <button type="button" onClick={() => setEditando(true)} className="px-6 py-2.5 rounded-xl text-xs font-bold border-2 border-[#a8c0a0]/50 text-[#7d9b76] hover:bg-[#7d9b76] hover:text-white transition-all">Editar Perfil</button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#a8c0a0]/30 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center justify-between pb-3 border-b border-[#a8c0a0]/20">
              <span className="flex items-center gap-2"><CalendarClock className="h-5 w-5 text-[#7d9b76]" /> Agenda de Descartes</span>
              <span className="bg-[#f5f0e8] text-[#7d9b76] px-3 py-1 rounded-full text-xs font-black">{agendamentos.length}</span>
            </h2>

            <div className="space-y-4">
              {agendamentos.length === 0 ? (
                <div className="text-center py-10 bg-[#f5f0e8]/50 rounded-2xl border-2 border-dashed border-[#a8c0a0]/40">
                  <Recycle className="h-8 w-8 mx-auto text-[#a8c0a0] mb-3" />
                  <p className="text-sm font-medium text-[#1a2421]/60">Nenhum descarte programado no momento.</p>
                </div>
              ) : (
                agendamentos.map((agendamento) => {
                  const dataAgendamento = new Date(agendamento.dataHora);
                  const isConcluido = agendamento.statusEnum === 'CONCLUIDO' || dataAgendamento < new Date() && agendamento.statusEnum !== 'PENDENTE'; 
                  const idResiduoReal = agendamento.wasteId || agendamento.wasteItem?.id; 

                  return (
                    <div key={agendamento.id} className="p-5 rounded-2xl border border-[#a8c0a0]/30 hover:border-[#7d9b76] hover:shadow-md transition-all bg-white flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl flex-shrink-0 transition-colors ${isConcluido ? 'bg-gray-100 text-gray-400' : 'bg-[#dce5d4] text-[#7d9b76] group-hover:bg-[#7d9b76] group-hover:text-white'}`}>
                          <Recycle className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#1a2421] text-sm md:text-base">
                            {getNomeResiduo(idResiduoReal)} <span className="text-[#1a2421]/50 font-medium">({agendamento.quantidade || 0}{String(idResiduoReal) === '1' ? 'L' : 'kg'})</span>
                          </h4>
                          <div className="flex flex-col gap-1.5 mt-2">
                            <span className="text-xs text-[#1a2421]/60 flex items-center gap-1.5 font-medium"><MapPin className="h-3.5 w-3.5 text-[#7d9b76]" /> {agendamento.enderecoColeta}</span>
                            <span className="text-xs text-[#1a2421]/60 flex items-center gap-1.5 font-medium"><Clock className="h-3.5 w-3.5 text-[#7d9b76]" /> {dataAgendamento.toLocaleDateString('pt-BR')} às {dataAgendamento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:flex-col sm:items-end">
                        <span className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-black rounded-lg ${isConcluido ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {isConcluido ? 'Concluído' : 'Aguardando Entrega'}
                        </span>
                        
                        {!isConcluido && (
                          <div className="flex gap-2 mt-2 sm:mt-0">
                            <button onClick={() => handleSimularEntrega(agendamento.id)} title="Apenas para demonstração" className="text-green-600 hover:text-white hover:bg-green-600 border border-green-200 p-2 rounded-lg transition-all flex items-center gap-1 text-xs font-bold">
                               <CheckCircle className="h-4 w-4" /> <span className="sm:hidden">Confirmar</span>
                            </button>
                            <button onClick={() => handleCancelarAgendamento(agendamento.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent p-2 rounded-lg transition-all flex items-center gap-1 text-xs font-bold">
                               <Trash2 className="h-4 w-4" /> <span className="sm:hidden">Cancelar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 w-full lg:sticky lg:top-6 animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="bg-gradient-to-br from-[#7d9b76] to-[#516b4c] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block">Ofensiva Atual</span>
                <span className="text-4xl font-black mt-2 block tracking-tight">{usuarioLogado.streak || 0} Dias</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                <Flame className="h-8 w-8 text-orange-400 fill-current animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-white/80 leading-relaxed mt-6 font-medium relative z-10 border-t border-white/10 pt-4">Mantenha o ritmo! Descartes consistentes ativam multiplicadores.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#a8c0a0]/30 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#1a2421]/40 mb-6">Métricas de Impacto</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-[#f5f0e8] text-[#7d9b76] flex items-center justify-center border border-[#a8c0a0]/30 group-hover:bg-[#7d9b76] group-hover:text-white transition-colors">
                  <Recycle className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1a2421]/50 uppercase tracking-wider block">Volume Desviado</span>
                  <strong className="text-xl font-black text-[#1a2421]">{usuarioLogado.totalResiduosKg || 0} kg/L</strong>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-[#f5f0e8] text-[#7d9b76] flex items-center justify-center border border-[#a8c0a0]/30 transition-colors relative">
                  <Award className="h-5 w-5" />
                  {usuarioLogado.pontosPendentes > 0 && <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 rounded-full animate-ping"></span>}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-[#1a2421]/50 uppercase tracking-wider block mb-1">Saldo na Carteira</span>
                  <div className="flex flex-col gap-1">
                    <strong className="text-xl font-black text-[#7d9b76] leading-none">{usuarioLogado.totalPontos || 0} ECO</strong>
                    {usuarioLogado.pontosPendentes > 0 && (
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded w-fit" title="Libertados após entregar no Ecoponto">
                        <Clock size={10} /> +{usuarioLogado.pontosPendentes} cativos
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
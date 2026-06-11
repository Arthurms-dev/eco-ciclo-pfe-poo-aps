'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { User, Mail, Flame, Recycle, Award, MapPin, CalendarClock, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore"; 
import useSWR from 'swr';

const API_URL = 'https://eco-ciclo-pfe-poo-aps-backend.onrender.com';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Erro ao buscar dados');
  return res.json();
});

export default function PerfilPage() {
  const usuarioLogado = useAuthStore((state) => state.user);
  const atualizarSessaoLocal = useAuthStore((state) => state.login); 

  const [editando, setEditando] = useState(false);
  const [nomeForm, setNomeForm] = useState("");
  const [cidadeForm, setCidadeForm] = useState("Recife - PE");

  const { data: todosAgendamentos = [], mutate } = useSWR(
    `${API_URL}/api/agendamentos`,
    fetcher,
    { refreshInterval: 3000 } 
  );

  const agendamentos = todosAgendamentos.filter(ag => {
    const idDonoDoAgendamento = ag.userId || ag.user?.id;
    return usuarioLogado && String(idDonoDoAgendamento) === String(usuarioLogado.id);
  });

  const formatarNome = (txt) => {
    if (!txt) return "";
    return txt
      .toLowerCase()
      .split(" ")
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if (usuarioLogado) {
      setNomeForm(formatarNome(usuarioLogado.nome) || "");
    }
  }, [usuarioLogado]);

  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <p className="text-sm font-medium text-gray-500">Carregando dados do perfil...</p>
      </div>
    );
  }

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    const nomeCorrigido = formatarNome(nomeForm);
    const usuarioAtualizado = { ...usuarioLogado, nome: nomeCorrigido };

    try {
      const response = await fetch(`${API_URL}/api/usuarios/${usuarioLogado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioAtualizado)
      });

      if (response.ok) {
        const dadosDoServidor = await response.json();
        dadosDoServidor.nome = formatarNome(dadosDoServidor.nome);
        atualizarSessaoLocal(dadosDoServidor);
        toast.success("Informações cadastrais atualizadas com sucesso!");
        setEditando(false);
      } else {
        toast.error("Erro ao salvar as alterações no servidor.");
      }
    } catch (err) {
      console.error(err);
      atualizarSessaoLocal(usuarioAtualizado);
      toast.success("Perfil atualizado localmente (Modo de Contingência)!");
      setEditando(false);
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
    if (!confirm("Deseja realmente cancelar este agendamento?")) return;

    try {
      const response = await fetch(`${API_URL}/api/agendamentos/${idAgendamento}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok || response.status === 204) {
        toast.success("Agendamento cancelado!");
        mutate();

        const userResponse = await fetch(`${API_URL}/api/usuarios/${usuarioLogado.id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          atualizarSessaoLocal(userData);
        }
        
      } else {
        const text = await response.text();
        console.error("Erro do servidor:", text);
        toast.error("O servidor recusou a exclusão.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-6 md:p-12 font-sans text-[#1a2421]">
      <div className="max-w-5xl mx-auto mb-8">
        <span className="text-xs font-semibold text-[#7d9b76] uppercase tracking-widest block mb-2">
          Área do Usuário
        </span>
        <h1 className="text-4xl font-extrabold font-heading text-[#1a2421]">
          Olá, {formatarNome(usuarioLogado.nome)}!
        </h1>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-[#a8c0a0]/15 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 pb-2 border-b border-[#f5f0e8]">
              <User className="h-5 w-5 text-[#7d9b76]" /> Informações da Conta
            </h2>

            <form onSubmit={handleSalvarPerfil} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#1a2421]/60 uppercase mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={nomeForm}
                  disabled={!editando}
                  onChange={(e) => setNomeForm(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f5f0e8]/30 border border-[#a8c0a0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm text-[#1a2421] disabled:opacity-60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2421]/60 uppercase mb-2">Endereço de E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-[#1a2421]/40" />
                  <input
                    type="email"
                    value={usuarioLogado.email || "não informado"} 
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-[#f5f0e8]/10 border border-gray-200 rounded-xl text-sm text-[#1a2421]/50 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2421]/60 uppercase mb-2">Localidade Base</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-[#7d9b76]" />
                  <input
                    type="text"
                    value={cidadeForm}
                    disabled={!editando}
                    onChange={(e) => setCidadeForm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#f5f0e8]/30 border border-[#a8c0a0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76] text-sm text-[#1a2421] disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                {editando ? (
                  <>
                    <button
                      type="button"
                      onClick={() => { setEditando(false); setNomeForm(formatarNome(usuarioLogado.nome) || ""); }}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7d9b76] text-[#f5f0e8] hover:bg-[#6c8866] transition-colors shadow-sm cursor-pointer"
                    >
                      Salvar Alterações
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditando(true)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#a8c0a0] text-[#7d9b76] hover:bg-[#dce5d4]/40 transition-all cursor-pointer"
                  >
                    Editar Perfil
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white border border-[#a8c0a0]/15 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#f5f0e8] mb-6">
              <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-[#7d9b76]" /> Meus Agendamentos
              </h2>
            </div>

            <div className="space-y-4">
              {agendamentos.length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-[#f5f0e8]/30 rounded-2xl border border-dashed border-[#a8c0a0]/50">
                  <p className="text-sm">Você ainda não tem coletas agendadas.</p>
                </div>
              ) : (
                agendamentos.map((agendamento) => {
                  const dataAgendamento = new Date(agendamento.dataHora);
                  const isConcluido = dataAgendamento < new Date(); 
                  const idResiduoReal = agendamento.wasteId || agendamento.wasteItem?.id; 

                  return (
                    <div key={agendamento.id} className="p-4 rounded-2xl border border-[#f5f0e8] hover:border-[#a8c0a0]/50 transition-all bg-white shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl flex-shrink-0 ${isConcluido ? 'bg-[#f5f0e8] text-gray-400' : 'bg-[#dce5d4] text-[#7d9b76]'}`}>
                          <Recycle className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1a2421] text-sm">
                            {getNomeResiduo(idResiduoReal)} ({agendamento.quantidade || 0} {String(idResiduoReal) === '1' ? 'L' : 'kg'})
                          </h4>
                          <div className="flex flex-col gap-1 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                              <MapPin className="h-3 w-3" /> {agendamento.enderecoColeta}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                              <Clock className="h-3 w-3" /> 
                              {dataAgendamento.toLocaleDateString('pt-BR')} às {dataAgendamento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:flex-col sm:items-end">
                        <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                          isConcluido 
                            ? 'bg-gray-100 text-gray-500' 
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {isConcluido ? 'Concluído' : 'Pendente'}
                        </span>
                        
                          {!isConcluido && (
                            <button 
                            onClick={() => handleCancelarAgendamento(agendamento.id)} 
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                        >
                       <Trash2 className="h-4 w-4" />
                        </button>
                        )}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 w-full lg:sticky lg:top-6">
          <div className="bg-gradient-to-br from-[#7d9b76] to-[#6c8866] rounded-3xl p-6 text-[#f5f0e8] shadow-sm flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f5f0e8]/70 block">Sua Ofensiva</span>
                <span className="text-3xl font-black mt-1 block">
                  {usuarioLogado.streak || 0} Dias Seguidos
                </span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                <Flame className="h-6 w-6 text-orange-400 fill-current animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-[#f5f0e8]/80 leading-relaxed mt-4">
              Continue descartando materiais periodicamente para não perder seu bônus de multiplicador!
            </p>
          </div>

          <div className="bg-white border border-[#a8c0a0]/15 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2421]/40 mb-2">Estatísticas Gerais</h3>
            
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#dce5d4]/50 text-[#7d9b76] flex items-center justify-center">
                <Recycle className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs text-[#1a2421]/60 block leading-none">Total reciclado</span>
                <strong className="text-base text-[#1a2421]">
                  {usuarioLogado.totalResiduosKg || 0} kg/L
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#dce5d4]/50 text-[#7d9b76] flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs text-[#1a2421]/60 block leading-none">Saldo de Pontos</span>
                <strong className="text-base text-[#7d9b76]">
                  {usuarioLogado.totalPontos || 0} ECO
                </strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
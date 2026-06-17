'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import useSWR, { mutate as globalMutate } from 'swr';
import { MapPin, Check, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore'; 
import api from '../../services/api'; 

const fetcher = (url) => api.get(url).then(res => res.data);

export default function FormAgendamento({ onAgendamentoSucesso }) {
  const router = useRouter(); 
  const usuarioLogado = useAuthStore((state) => state.user);
  const atualizarSessaoLocal = useAuthStore((state) => state.setUser || state.login);
  
  const { data: pontos = [], error: erroPontos, isLoading: carregandoPontos, mutate: mutatePontos } = useSWR(
    `/collection-points`, fetcher, { refreshInterval: 3000 } 
  );
  const { data: todosAgendamentos = [] } = useSWR(
    `/agendamentos`, fetcher, { refreshInterval: 3000 }
  );

  const [pontoColetaId, setPontoColetaId] = useState('');
  const [wasteId, setWasteId] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [quantidadeConfirmada, setQuantidadeConfirmada] = useState(false);
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');

  const [erro, setErro] = useState('');
  const [campoComErro, setCampoComErro] = useState(''); 
  const [isShaking, setIsShaking] = useState(false);     
  const [sucesso, setSucesso] = useState(false); 
  const [carregando, setCarregando] = useState(false);

  const horariosDisponiveis = ['08:00', '09:30', '11:00', '13:30', '15:00', '16:30'];
  const pontoSelecionado = pontos.find(p => p.id.toString() === pontoColetaId.toString());

  const getUnidadeMedida = () => wasteId === '1' ? 'L' : 'kg';

  const horariosFiltrados = horariosDisponiveis.filter(hora => {
    if (!data || !pontoColetaId) return true;
    const dataHoraSlot = `${data}T${hora}:00`;
    const dataHoraSlotObj = new Date(dataHoraSlot);
    const agora = new Date();
    if (dataHoraSlotObj < agora) return false; 
    
    const estaOcupado = todosAgendamentos.some(ag => {
      if (!ag.dataHora) return false;
      const dataAgendadaDb = new Date(ag.dataHora).getTime();
      const dataDoSelect = dataHoraSlotObj.getTime();
      return (dataAgendadaDb === dataDoSelect) && (ag.enderecoColeta === pontoSelecionado?.endereco);
    });
    return !estaOcupado;
  });

  const handleResetarFormulario = () => {
    setPontoColetaId(''); setWasteId(''); setQuantidade('1'); setQuantidadeConfirmada(false);
    setData(''); setHorario(''); setErro(''); setSucesso(false);
  };

  const handleAgendar = async (e) => {
    if (e) e.preventDefault();
    if (!usuarioLogado) return setErro("Usuário não identificado. Faça login novamente.");
    
    setErro(''); setCampoComErro(''); setIsShaking(false);

    const dispararErro = (mensagem, campo) => {
      setErro(mensagem); setCampoComErro(campo); setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    };

    if (!pontoColetaId) return dispararErro('Selecione um ponto de coleta válido.', 'ponto');
    if (!wasteId) return dispararErro('Selecione o tipo de resíduo.', 'residuo');
    if (quantidade < 1) return dispararErro(`A quantidade mínima é 1 ${getUnidadeMedida()}.`, 'quantidade');
    if (!data) return dispararErro('Escolha uma data.', 'data');
    if (!horario) return dispararErro('Selecione um horário.', 'horario');

    const dataHoraCombinada = `${data}T${horario}:00`;
    if (new Date(dataHoraCombinada) < new Date()) {
      return dispararErro('A data escolhida já passou.', 'data');
    }

    setCarregando(true);
    const payload = {
      userId: usuarioLogado.id, 
      pontoColetaId: Number(pontoColetaId),
      wasteId: Number(wasteId),
      quantidade: Number(quantidade), 
      dataHora: dataHoraCombinada,
      enderecoColeta: pontoSelecionado ? pontoSelecionado.endereco : "Endereço não encontrado", 
    };

    try {
      await api.post('/agendamentos', payload);

      let pontosGanhos = Number(quantidade) * 50;
      if (wasteId === '1') pontosGanhos *= 2; 

      const usuarioAtualizado = {
        ...usuarioLogado,
        pontosPendentes: (usuarioLogado.pontosPendentes || 0) + pontosGanhos
      };
      
      if (atualizarSessaoLocal) atualizarSessaoLocal(usuarioAtualizado); 
      globalMutate(`/agendamentos`);
      globalMutate(`/collection-points`); 
      mutatePontos();
      
      setSucesso(true);
      if (onAgendamentoSucesso) onAgendamentoSucesso();
    } catch (err) {
      dispararErro(err.response?.data?.mensagem || 'Falha na comunicação com o servidor.', 'servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f5f0e8] p-6 md:p-10 font-sans text-[#1a2421] relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes erroShake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        .animate-shake { animation: erroShake 0.4s ease-in-out; }
      `}} />
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7d9b76]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <span className="inline-block px-3 py-1 bg-[#7d9b76]/10 text-[#7d9b76] text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
          Logística Reversa
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a2421] tracking-tight">Agendar Descarte</h1>
        <p className="text-[#1a2421]/60 text-sm mt-2 max-w-xl font-medium">
          Reserve o seu espaço no Ecoponto. Os seus pontos ECO ficarão pendentes até a confirmação da entrega no local!
        </p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-[#a8c0a0]/30 shadow-sm w-full min-h-[460px] flex flex-col justify-center relative z-10 hover:shadow-md transition-shadow">
          {sucesso ? (
            <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1a2421]">Agendamento Confirmado!</h3>
                <p className="text-[#1a2421]/60 text-sm mt-2 max-w-xs mx-auto font-medium">
                  Tudo certo. O parceiro já foi notificado. Verifique o seu E-mail para os detalhes!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button type="button" onClick={handleResetarFormulario} className="px-6 py-3 bg-[#7d9b76] hover:bg-[#6c8866] hover:scale-105 transition-all text-white text-sm font-bold rounded-xl shadow-md">
                  Agendar Novo
                </button>
                <button type="button" onClick={() => router.push('/profile')} className="px-6 py-3 bg-[#f5f0e8] hover:bg-[#eadecc] text-[#1a2421] text-sm font-bold rounded-xl transition-colors border border-[#a8c0a0]/30">
                  Ver Meus Descartes
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAgendar} className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${campoComErro === 'ponto' && isShaking ? 'animate-shake' : ''}`}>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1a2421]/70">Ponto de Descarte</label>
                  <select 
                    value={pontoColetaId} onChange={(e) => { setPontoColetaId(e.target.value); setHorario(''); if(campoComErro === 'ponto') setCampoComErro(''); }} disabled={carregandoPontos || erroPontos}
                    className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76]/50 text-sm disabled:opacity-60 transition-all ${
                      campoComErro === 'ponto' ? 'border-red-400 bg-red-50 text-red-900' : pontoColetaId ? 'border-[#7d9b76] bg-[#f5f0e8]/50 text-[#1a2421] font-medium' : 'border-[#a8c0a0]/40 bg-white/50 text-gray-500'
                    }`}
                  >
                    <option value="" disabled hidden>Selecione um local</option>
                    {pontos.map(ponto => (<option key={ponto.id} value={ponto.id} className="text-gray-800">{ponto.nomeUnidade}</option>))}
                  </select>
                </div>
                
                <div className={`${campoComErro === 'residuo' && isShaking ? 'animate-shake' : ''}`}>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1a2421]/70">Tipo de Resíduo</label>
                  <select 
                    value={wasteId} onChange={(e) => { setWasteId(e.target.value); if(campoComErro === 'residuo') setCampoComErro(''); }}
                    className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76]/50 text-sm transition-all ${
                      campoComErro === 'residuo' ? 'border-red-400 bg-red-50 text-red-900' : wasteId ? 'border-[#7d9b76] bg-[#f5f0e8]/50 text-[#1a2421] font-medium' : 'border-[#a8c0a0]/40 bg-white/50 text-gray-500'
                    }`}
                  >
                    <option value="" disabled hidden>Classifique o material</option>
                    <option value="1">Óleo de Cozinha Usado (L)</option>
                    <option value="2">Baterias Velhas (kg)</option>
                    <option value="3">Resíduos Eletrônicos (kg)</option>    
                    <option value="4">Papel, Vidro ou Metal (kg)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${campoComErro === 'quantidade' && isShaking ? 'animate-shake' : ''}`}>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1a2421]/70">Quantidade Estimada ({getUnidadeMedida()})</label>
                  <input 
                    type="number" min="1" value={quantidade} onBlur={() => setQuantidadeConfirmada(true)}
                    onChange={(e) => { setQuantidade(e.target.value); setQuantidadeConfirmada(false); if(campoComErro === 'quantidade') setCampoComErro(''); }}
                    className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76]/50 text-sm transition-all ${
                      campoComErro === 'quantidade' ? 'border-red-400 bg-red-50 text-red-900' : quantidadeConfirmada ? 'border-[#7d9b76] bg-[#f5f0e8]/50 text-[#1a2421] font-medium' : 'border-[#a8c0a0]/40 bg-white/50 text-[#1a2421]'
                    }`}
                  />
                </div>
                
                <div className={`${campoComErro === 'data' && isShaking ? 'animate-shake' : ''}`}>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1a2421]/70">Data de Entrega</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className={`h-4 w-4 ${campoComErro === 'data' ? 'text-red-400' : 'text-[#7d9b76]'}`} />
                    </div>
                    <input 
                      type="date" value={data} onChange={(e) => { setData(e.target.value); setHorario(''); if(campoComErro === 'data') setCampoComErro(''); }}
                      className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d9b76]/50 text-sm transition-all ${
                        campoComErro === 'data' ? 'border-red-400 bg-red-50 text-red-900' : data ? 'border-[#7d9b76] bg-[#f5f0e8]/50 text-[#1a2421] font-medium' : 'border-[#a8c0a0]/40 bg-white/50 text-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className={`transition-all ${campoComErro === 'horario' && isShaking ? 'animate-shake' : ''}`}>
                <label className="block text-xs font-bold uppercase tracking-wider mb-3 text-[#1a2421]/70">Horários Livres no Ecoponto</label>
                {horariosFiltrados.length === 0 && data && pontoColetaId ? (
                  <p className="text-xs text-orange-600 bg-orange-50 p-3 rounded-xl border border-orange-200 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Capacidade esgotada neste local para o dia selecionado.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {horariosFiltrados.map((hora) => (
                      <button
                        key={hora} type="button" onClick={() => { setHorario(horario === hora ? '' : hora); if (campoComErro === 'horario') setCampoComErro(''); }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          horario === hora ? 'bg-[#7d9b76] text-white shadow-md shadow-[#7d9b76]/30 scale-105' : campoComErro === 'horario' ? 'border border-red-300 text-red-500 bg-red-50' : 'border border-[#a8c0a0]/40 text-[#1a2421]/70 bg-white hover:border-[#7d9b76] hover:text-[#7d9b76]'
                        }`}
                      >
                        <Clock className="w-4 h-4" /> {hora}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {erro && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold animate-in slide-in-from-top-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p>{erro}</p>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="w-full lg:w-[380px] bg-gradient-to-b from-[#7d9b76] to-[#516b4c] p-8 rounded-[2rem] shadow-xl text-white flex flex-col justify-between min-h-[460px] relative z-10 transition-transform hover:-translate-y-1 duration-500">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2 block">Fechamento</span>
            <h2 className="text-2xl font-black mb-6 border-b border-white/10 pb-4">Resumo da Ordem</h2>
            
            <ul className="space-y-5 mb-6">
              <li className={`flex items-start gap-3 text-sm ${pontoSelecionado ? 'text-white' : 'text-white/40'}`}>
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="leading-tight">{pontoSelecionado ? pontoSelecionado.nomeUnidade : 'Nenhum local selecionado'}</span>
              </li>
              <li className={`flex items-center gap-3 text-sm ${wasteId ? 'text-white' : 'text-white/40'}`}>
                <Check className="w-5 h-5 shrink-0" />
                <span>{wasteId ? `Carga: ${quantidade} ${getUnidadeMedida()}` : 'Resíduo não classificado'}</span>
              </li>
              <li className={`flex items-center gap-3 text-sm ${data && horario ? 'text-white' : 'text-white/40'}`}>
                <Calendar className="w-5 h-5 shrink-0" />
                <span>{data && horario ? `${data.split('-').reverse().join('/')} às ${horario}` : 'Data pendente'}</span>
              </li>
            </ul>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl mb-6 border border-white/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1 flex items-center justify-between">
                Pontos Projetados <Clock className="h-3 w-3 text-amber-300 animate-pulse" />
              </p>
              <p className="text-4xl font-extrabold text-white flex items-baseline gap-2 mt-2">
                +{wasteId ? (wasteId === '1' ? quantidade * 100 : quantidade * 50) : 0}
                <span className="text-sm font-medium text-white/70">ECO</span>
              </p>
            </div>
          </div>

          <button 
            type="button" onClick={handleAgendar} disabled={carregando || sucesso}
            className="w-full bg-white text-[#516b4c] hover:bg-[#f5f0e8] hover:scale-[1.02] py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg cursor-pointer"
          >
            {carregando ? 'A Processar...' : sucesso ? 'Concluído!' : 'Agendar e Reter Pontos'}
          </button>
        </div>
      </div>
    </div>
  );
}
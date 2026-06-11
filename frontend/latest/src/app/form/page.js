'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import useSWR, { mutate as globalMutate } from 'swr';
import { MapPin, Check, Calendar, Clock, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore'; 

const API_URL = 'https://eco-ciclo-pfe-poo-aps-backend.onrender.com';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Erro ao buscar dados da API');
  return res.json();
});

export default function FormAgendamento({ onAgendamentoSucesso }) {
  const router = useRouter(); 
  const usuarioLogado = useAuthStore((state) => state.user);
  
  const atualizarSessaoLocal = useAuthStore((state) => state.setUser || state.login);
  const { data: pontos = [], error: erroPontos, isLoading: carregandoPontos, mutate: mutatePontos } = useSWR(
    `${API_URL}/api/collection-points`, 
    fetcher,
    { refreshInterval: 3000 } 
  );

  const { data: todosAgendamentos = [] } = useSWR(
    `${API_URL}/api/agendamentos`,
    fetcher,
    { refreshInterval: 3000 }
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

    if (dataHoraSlotObj < agora) {
      return false; 
    }
    
    const estaOcupado = todosAgendamentos.some(ag => {
      if (!ag.dataHora) return false;
      const dataAgendadaDb = new Date(ag.dataHora).getTime();
      const dataDoSelect = dataHoraSlotObj.getTime();
      const mesmoHorario = dataAgendadaDb === dataDoSelect;
      const mesmoPonto = ag.enderecoColeta === pontoSelecionado?.endereco;

      return mesmoHorario && mesmoPonto;
    });
    
    return !estaOcupado;
  });

  const handleResetarFormulario = () => {
    setPontoColetaId('');
    setWasteId('');
    setQuantidade('1');
    setQuantidadeConfirmada(false);
    setData('');
    setHorario('');
    setErro('');
    setSucesso(false);
  };

  const handleAgendar = async (e) => {
    if (e) e.preventDefault();
    if (!usuarioLogado) return setErro("Usuário não identificado. Faça login novamente.");
    
    setErro('');
    setCampoComErro('');
    setIsShaking(false);

    const dispararErro = (mensagem, campo) => {
      setErro(mensagem);
      setCampoComErro(campo);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    };

    if (!pontoColetaId) return dispararErro('Selecione um ponto de coleta válido.', 'ponto');
    if (!wasteId) return dispararErro('Selecione o tipo de resíduo.', 'residuo');
    if (quantidade < 1) return dispararErro(`A quantidade deve ser de pelo menos 1 ${getUnidadeMedida()}.`, 'quantidade');
    if (!data) return dispararErro('Escolha uma data para a coleta.', 'data');
    if (!horario) return dispararErro('Selecione um horário disponível.', 'horario');

    const dataHoraCombinada = `${data}T${horario}:00`;
    if (new Date(dataHoraCombinada) < new Date()) {
      return dispararErro('A data e horário escolhidos já passaram.', 'data');
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
      const response = await fetch(`${API_URL}/api/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        let pontosGanhos = Number(quantidade) * 50;
        if (wasteId === '1') pontosGanhos *= 2; 

        const usuarioAtualizado = {
          ...usuarioLogado,
          totalResiduosKg: (usuarioLogado.totalResiduosKg || 0) + Number(quantidade),
          totalPontos: (usuarioLogado.totalPontos || 0) + pontosGanhos
        };
        
        if (atualizarSessaoLocal) {
          atualizarSessaoLocal(usuarioAtualizado); 
        }
        
        globalMutate(`${API_URL}/api/agendamentos`);
        globalMutate(`${API_URL}/api/collection-points`); 
        mutatePontos();
        
        setSucesso(true);
        if (onAgendamentoSucesso) onAgendamentoSucesso();
      } else {
        const erroDoJava = await response.text();
        dispararErro(`O servidor recusou: ${erroDoJava}`, 'servidor');
      }
    } catch (err) {
      dispararErro('Falha na comunicação com o servidor.', 'servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFDF8] p-8 font-sans text-slate-800">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes erroShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: erroShake 0.4s ease-in-out; }
      `}} />
      
      <div className="max-w-5xl mx-auto mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Agendamento</p>
        <h1 className="text-4xl font-extrabold text-[#232F2A] mb-3">Agende sua coleta</h1>
        <p className="text-gray-600 text-sm">Escolha o ponto, o resíduo, a data e o horário.</p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm w-full min-h-[460px] flex flex-col justify-center">
          {sucesso ? (
            <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-[#708769]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#232F2A]">Coleta Agendada!</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                  Seu agendamento foi registrado com sucesso no sistema.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  type="button"
                  onClick={handleResetarFormulario}
                  className="px-6 py-3 bg-[#708769] hover:bg-[#5C7056] text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Agendar outro resíduo
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/profile')} 
                  className="px-6 py-3 bg-[#F4F5EE] hover:bg-[#EBECE1] text-[#4A5D45] text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Ver meus agendamentos
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAgendar} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className={`${campoComErro === 'ponto' && isShaking ? 'animate-shake' : ''}`}>
                  <label className={`block text-sm font-medium mb-2 ${campoComErro === 'ponto' ? 'text-red-500 font-semibold' : 'text-gray-700'}`}>
                    Ponto de coleta
                  </label>
                  <select 
                    value={pontoColetaId}
                    onChange={(e) => { setPontoColetaId(e.target.value); setHorario(''); if(campoComErro === 'ponto') setCampoComErro(''); }}
                    disabled={carregandoPontos || erroPontos}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none text-sm disabled:opacity-60 transition-all ${
                      campoComErro === 'ponto' 
                        ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20' 
                        : pontoColetaId 
                          ? 'border-[#708769] bg-[#F4F5EE] text-gray-800 font-medium'
                          : 'border-gray-200 bg-white text-gray-400'
                    }`}
                  >
                    <option value="" disabled hidden>Selecione um ponto</option>
                    {pontos.map(ponto => (
                      <option key={ponto.id} value={ponto.id} className="text-gray-800">
                        {ponto.nomeUnidade}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={`${campoComErro === 'residuo' && isShaking ? 'animate-shake' : ''}`}>
                  <label className={`block text-sm font-medium mb-2 ${campoComErro === 'residuo' ? 'text-red-500 font-semibold' : 'text-gray-700'}`}>
                    Tipo de resíduo
                  </label>
                  <select 
                    value={wasteId}
                    onChange={(e) => { setWasteId(e.target.value); if(campoComErro === 'residuo') setCampoComErro(''); }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none text-sm transition-all ${
                      campoComErro === 'residuo' 
                        ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20 text-red-900' 
                        : wasteId
                          ? 'border-[#708769] bg-[#F4F5EE] text-gray-800 font-medium'
                          : 'border-gray-200 bg-white text-gray-400'
                    }`}
                  >
                    <option value="" disabled hidden>Selecione um resíduo</option>
                    <option value="1" className="text-gray-800">Óleo de Cozinha Usado (L)</option>
                    <option value="2" className="text-gray-800">Baterias Velhas (kg)</option>
                    <option value="3" className="text-gray-800">Resíduos Eletrônicos (kg)</option>    
                    <option value="4" className="text-gray-800">Papel, Vidro ou Metal (kg)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${campoComErro === 'quantidade' && isShaking ? 'animate-shake' : ''}`}>
                  <label className={`block text-sm font-medium mb-2 ${campoComErro === 'quantidade' ? 'text-red-500 font-semibold' : 'text-gray-700'}`}>
                    Quantidade ({getUnidadeMedida()})
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantidade}
                    onBlur={() => setQuantidadeConfirmada(true)}
                    onChange={(e) => { 
                      setQuantidade(e.target.value); 
                      setQuantidadeConfirmada(false); 
                      if(campoComErro === 'quantidade') setCampoComErro(''); 
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none text-sm transition-all ${
                      campoComErro === 'quantidade' 
                        ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20' 
                        : quantidadeConfirmada
                          ? 'border-[#708769] bg-[#F4F5EE] text-gray-800 font-medium'
                          : 'border-gray-200 bg-white text-gray-800'
                    }`}
                  />
                </div>
                
                <div className={`${campoComErro === 'data' && isShaking ? 'animate-shake' : ''}`}>
                  <label className={`block text-sm font-medium mb-2 ${campoComErro === 'data' ? 'text-red-500 font-semibold' : 'text-gray-700'}`}>
                    Data
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className={`h-4 w-4 ${campoComErro === 'data' ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input 
                      type="date" 
                      value={data}
                      onChange={(e) => { setData(e.target.value); setHorario(''); if(campoComErro === 'data') setCampoComErro(''); }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none text-sm transition-all ${
                        campoComErro === 'data' 
                          ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20 text-red-900' 
                          : data
                            ? 'border-[#708769] bg-[#F4F5EE] text-gray-800 font-medium'
                            : 'border-gray-200 bg-white text-gray-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className={`transition-all ${campoComErro === 'horario' && isShaking ? 'animate-shake' : ''}`}>
                <label className={`block text-sm font-medium mb-3 ${campoComErro === 'horario' ? 'text-red-500 font-bold' : 'text-gray-700'}`}>
                  Horários disponíveis
                </label>
                {horariosFiltrados.length === 0 && data && pontoColetaId ? (
                  <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                    Nenhum horário disponível para este ponto nesta data.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {horariosFiltrados.map((hora) => (
                      <button
                        key={hora}
                        type="button"
                        onClick={() => {
                          setHorario(horario === hora ? '' : hora);
                          if (campoComErro === 'horario') setCampoComErro('');
                        }}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-all ${
                          horario === hora 
                            ? 'border-[#708769] bg-[#708769]/10 text-[#708769]' 
                            : campoComErro === 'horario'
                              ? 'border-red-300 text-red-500 bg-red-50/30'
                              : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        {hora}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {erro && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p>{erro}</p>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="w-full lg:w-[380px] bg-[#EBECE1] p-8 rounded-3xl border border-[#DFE1D4] flex flex-col justify-between min-h-[460px]">
          <div>
            <h2 className="text-xl font-bold text-[#232F2A] mb-6">Resumo</h2>
            <ul className="space-y-4 mb-6">
              <li className={`flex items-center gap-3 text-sm ${pontoSelecionado ? 'text-[#4A5D45] font-medium' : 'text-gray-500'}`}>
                <MapPin className={`w-4 h-4 ${pontoSelecionado ? 'text-[#708769]' : ''}`} />
                {pontoSelecionado ? pontoSelecionado.nomeUnidade : 'Escolha um ponto de coleta'}
              </li>
              <li className={`flex items-center gap-3 text-sm ${wasteId ? 'text-[#4A5D45] font-medium' : 'text-gray-500'}`}>
                <Check className="w-4 h-4" />
                {wasteId ? `Resíduo: ${quantidade} ${getUnidadeMedida()}` : 'Escolha o resíduo'}
              </li>
              <li className={`flex items-center gap-3 text-sm ${data && horario ? 'text-[#4A5D45] font-medium' : 'text-gray-500'}`}>
                <Calendar className="w-4 h-4" />
                {data && horario ? `${data.split('-').reverse().join('/')} às ${horario}` : 'Escolha data e horário'}
              </li>
            </ul>

            <div className="bg-white p-5 rounded-2xl mb-6 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pontos estimados</p>
              <p className="text-4xl font-extrabold text-[#708769]">
                +{wasteId ? (wasteId === '1' ? quantidade * 100 : quantidade * 50) : 0}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleAgendar}
            disabled={carregando || sucesso}
            className="w-full bg-[#708769] hover:bg-[#5C7056] text-white py-3.5 rounded-xl font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            {carregando ? 'A processar...' : sucesso ? 'Agendado!' : 'Confirmar agendamento'}
          </button>
        </div>
      </div>
    </div>
  );
}
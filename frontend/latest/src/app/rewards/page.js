'use client';

import * as React from "react";
import { useState } from "react";
import { Award, Ticket, CheckCircle, Copy, Info, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

const API_URL = 'https://eco-ciclo-pfe-poo-aps-backend.onrender.com';

export default function RecompensasPage() {
  const usuarioLogado = useAuthStore((state) => state.user);
  const atualizarSessaoLocal = useAuthStore((state) => state.login || state.setUser);
  
  
  const saldoPontos = usuarioLogado?.totalPontos || 0;

  const [meusCupons, setMeusCupons] = useState([]);

  const [recompensas] = useState([
    { 
      id: 1, 
      titulo: "R$ 15 em Desconto - Supermercado Verde", 
      pontos: 300, 
      categoria: "Alimentação", 
      empresa: "Hortifrúti Orgânico",
      comoUsar: "Apresente o código do cupom diretamente ao caixa em qualquer unidade física do Hortifrúti Orgânico antes de passar suas compras."
    },
    { 
      id: 2, 
      titulo: "Isenção de Taxa na Próxima Coleta Premium", 
      pontos: 500, 
      categoria: "Serviço", 
      empresa: "EcoCiclo Logística",
      comoUsar: "O benefício está vinculado à sua conta. Copie o código e insira-o no campo de cupom na sua próxima tela de agendamento."
    },
    { 
      id: 3, 
      titulo: "Cupom de 20% OFF em Linha de Cosméticos Naturais", 
      pontos: 450, 
      categoria: "Beleza", 
      empresa: "BioEstética",
      comoUsar: "Insira este código promocional no campo 'Cupom de Desconto' na sacola de compras do site oficial da BioEstética."
    },
    { 
      id: 4, 
      titulo: "R$ 30 em Créditos de Passagem de Ônibus / VEM", 
      pontos: 800, 
      categoria: "Transporte", 
      empresa: "Vem Conectado",
      comoUsar: "Insira o código gerado no aplicativo 'Vem Conectado' ou valide-o em um dos terminais físicos do VEM no Recife."
    },
  ]);

  const handleResgatar = async (item) => {
    if (!usuarioLogado) {
      toast.error("Você precisa estar logado para resgatar prêmios.");
      return;
    }

    if (saldoPontos < item.pontos) {
      toast.error("Pontos ECO insuficientes para realizar este resgate.");
      return;
    }

    const novoSaldo = saldoPontos - item.pontos;
    const usuarioAtualizado = { ...usuarioLogado, totalPontos: novoSaldo };

    try {
      const response = await fetch(`${API_URL}/api/usuarios/${usuarioLogado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioAtualizado)
      });

      if (response.ok) {
        if (atualizarSessaoLocal) atualizarSessaoLocal(usuarioAtualizado);
        
        const codigoGerado = `ECO-${Math.floor(1000 + Math.random() * 9000)}`;
        const novoCupom = {
          idResgate: Date.now(),
          titulo: item.titulo,
          empresa: item.empresa,
          codigo: codigoGerado,
          comoUsar: item.comoUsar,
          data: new Date().toLocaleDateString('pt-BR')
        };

        setMeusCupons((prev) => [novoCupom, ...prev]);
        toast.success(`Cupom "${item.titulo}" resgatado com sucesso! Veja-o abaixo.`);
      } else {
        toast.error("Erro no servidor ao tentar abater os pontos.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Falha na comunicação com o servidor.");
    }
  };

  const copiarCodigo = (codigo) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(codigo);
      toast.success(`Código ${codigo} copiado!`);
    }
  };

  const handleUsarCupom = (idResgate, titulo) => {
    setMeusCupons((prev) => prev.filter(cupom => cupom.idResgate !== idResgate));
    toast.success(`Cupom "${titulo}" aplicado e utilizado com sucesso!`);
  };
  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7d9b76]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-6 md:p-12 font-sans text-[#1a2421]">

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <span className="text-xs font-semibold text-[#7d9b76] uppercase tracking-widest block mb-2">
            Marketplace Sustentável
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1a2421]">Recompensas Eco</h1>
          <p className="text-[#1a2421]/60 text-sm mt-1">
            Troque os pontos acumulados por vantagens exclusivas.
          </p>
        </div>

        <div className="bg-white border border-[#a8c0a0]/30 rounded-2xl p-4 flex items-center gap-4 shadow-sm min-w-[240px]">
          <div className="h-12 w-12 rounded-xl bg-[#7d9b76]/10 flex items-center justify-center text-[#7d9b76]">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#1a2421]/40 uppercase tracking-wider block">Seu Saldo Atual</span>
            <span className="text-2xl font-black text-[#7d9b76]">{saldoPontos} <span className="text-xs font-bold text-[#1a2421]/60">ECO</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        
        <div>
          <h2 className="text-xl font-bold text-[#1a2421] mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#7d9b76]" /> Benefícios para Troca
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recompensas.map((item) => {
              const podeResgatar = saldoPontos >= item.pontos;

              return (
                <div key={item.id} className="bg-white border border-[#a8c0a0]/15 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group transition-all hover:border-[#a8c0a0]/40">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-[#dce5d4]/30 rounded-bl-full flex items-start justify-end p-3 text-[#7d9b76]">
                    <Ticket className="h-4 w-4 transform group-hover:rotate-12 transition-transform" />
                  </div>

                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f5f0e8] text-[#7d9b76] text-[10px] font-bold uppercase tracking-wider mb-3">
                      {item.categoria}
                    </span>
                    <h3 className="text-lg font-bold text-[#1a2421] pr-8 leading-snug">
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-[#1a2421]/50 mt-1 font-medium">Parceiro: {item.empresa}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#f5f0e8] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-[#1a2421]/40 block uppercase font-bold">Custo</span>
                      <span className="text-xl font-extrabold text-[#1a2421]">
                        {item.pontos} <span className="text-xs font-semibold text-[#7d9b76]">ECO</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleResgatar(item)}
                      disabled={!podeResgatar}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        podeResgatar
                          ? "bg-[#7d9b76] hover:bg-[#6c8866] text-white cursor-pointer"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                      }`}
                    >
                      {podeResgatar ? "Resgatar" : "Insuficiente"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[#a8c0a0]/20">
          <h2 className="text-xl font-bold text-[#1a2421] mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#7d9b76]" /> Minhas Recompensas ({meusCupons.length})
          </h2>

          {meusCupons.length === 0 ? (
            <div className="bg-white/60 border-2 border-dashed border-[#a8c0a0]/30 rounded-2xl p-10 text-center">
              <p className="text-sm font-medium text-[#1a2421]/60">Nenhum resgate realizado ainda neste momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meusCupons.map((cupom) => (
                <div key={cupom.idResgate} className="bg-white border border-[#a8c0a0]/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                  
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] font-bold bg-[#7d9b76]/10 text-[#7d9b76] px-2 py-0.5 rounded">
                      Resgatado em {cupom.data}
                    </span>
                    <h3 className="text-base font-bold text-[#1a2421]">{cupom.titulo}</h3>
                    <div className="bg-[#f5f0e8]/60 border border-[#a8c0a0]/20 rounded-xl p-3 text-xs text-[#1a2421]/80">
                      <p className="font-bold text-[#7d9b76] flex items-center gap-1.5 uppercase tracking-wider text-[9px] mb-1">
                        <Info className="w-3.5 h-3.5" /> Como usar:
                      </p>
                      <p className="leading-relaxed font-medium">{cupom.comoUsar}</p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto bg-[#f5f0e8]/40 border border-gray-100 p-4 rounded-xl min-w-[180px] text-center space-y-2">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Código Voucher</span>
                      <span className="text-lg font-mono font-black text-[#1a2421] tracking-wider block mb-2">{cupom.codigo}</span>
                    </div>
                    
                    <button
                      onClick={() => copiarCodigo(cupom.codigo)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-gray-50 text-[#7d9b76] border border-[#a8c0a0]/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copiar Código
                    </button>

                    <button
                      onClick={() => handleUsarCupom(cupom.idResgate, cupom.titulo)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#eef4ec] hover:bg-[#dce5d4] text-[#7d9b76] border border-[#a8c0a0]/40 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Utilizar Cupom
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
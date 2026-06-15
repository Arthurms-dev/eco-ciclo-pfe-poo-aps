'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import { Leaf, Recycle, Calendar, Award, Flame, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const usuarioStore = useAuthStore((state) => state.user); 
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const usuarioLogado = isHydrated ? usuarioStore : null;

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1a2421] font-sans flex flex-col">

      {isHydrated && !usuarioLogado && (
        <header className="w-full max-w-6xl mx-auto px-6 py-5 flex justify-end items-center transition-opacity animate-in fade-in">
          <button 
            onClick={() => router.push('/login')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold border-2 border-[#7d9b76] text-[#7d9b76] hover:bg-[#7d9b76] hover:text-[#f5f0e8] transition-all cursor-pointer shadow-sm"
          >
            Entrar (Login)
          </button>
        </header>
      )}
      
      <section className="relative px-4 md:px-6 py-16 md:py-32 w-full max-w-6xl mx-auto flex flex-col items-center text-center overflow-hidden">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7d9b76]/10 text-[#7d9b76] text-[10px] sm:text-xs font-semibold mb-6 border border-[#7d9b76]/20 whitespace-nowrap">
          <Leaf className="h-3.5 w-3.5" /> Ciclos completos, gestos simples.
        </span>
        
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight sm:leading-[1.15] break-words">
          Transforme seus resíduos em <span className="text-[#7d9b76] block sm:inline">recompensas</span> para o planeta e para você.
        </h1>
        
        <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-xl text-[#1a2421]/70 max-w-2xl leading-relaxed px-2">
          O EcoCiclo ajuda você a gerenciar sua reciclagem doméstica, agendar coletas eficientes, acumular pontos ECO e manter hábitos sustentáveis com pontuações diárias.
        </p>
      </section>

      <section className="bg-[#dce5d4]/40 border-y border-[#a8c0a0]/20 py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">Como o EcoCiclo funciona?</h2>
            <p className="mt-2 text-sm text-[#1a2421]/60">Três passos simples para fechar o ciclo sustentável.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white/60 border border-[#a8c0a0]/20 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
              <div className="h-12 w-12 rounded-xl bg-[#7d9b76] text-[#f5f0e8] flex items-center justify-center mb-4 shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">1. Agende a Coleta</h3>
              <p className="mt-2 text-sm text-[#1a2421]/70 leading-relaxed">
                Escolha o melhor dia, horário e o tipo de resíduo que deseja descartar diretamente pela nossa plataforma.
              </p>
            </div>

            <div className="bg-white/60 border border-[#a8c0a0]/20 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
              <div className="h-12 w-12 rounded-xl bg-[#7d9b76] text-[#f5f0e8] flex items-center justify-center mb-4 shrink-0">
                <Recycle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">2. Descarte Correto</h3>
              <p className="mt-2 text-sm text-[#1a2421]/70 leading-relaxed">
                Nossos parceiros locais coletam o material e pesam os resíduos para garantir o destino ambiental correto.
              </p>
            </div>

            <div className="bg-white/60 border border-[#a8c0a0]/20 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
              <div className="h-12 w-12 rounded-xl bg-[#7d9b76] text-[#f5f0e8] flex items-center justify-center mb-4 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">3. Ganhe Prêmios</h3>
              <p className="mt-2 text-sm text-[#1a2421]/70 leading-relaxed">
                Cada quilo reciclado se transforma em pontos ECO que você pode trocar por cupons e benefícios em parceiros.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 md:px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#7d9b76]">Gamificação Sustentável</span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mt-2 leading-tight">
            Mantenha sua ofensiva e multiplique seu impacto
          </h2>
          <p className="mt-4 text-sm text-[#1a2421]/70 leading-relaxed">
            Criar um hábito sustentável exige consistência. Com a nossa mecânica de <strong>Ofensivas (Streaks)</strong>, realizar descartes periódicos mantém seu contador ativo, provando seu compromisso de longo prazo com o ecossistema.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex gap-3 items-start">
              <div className="mt-1 bg-orange-100 text-orange-500 p-1.5 rounded-lg shrink-0">
                <Flame className="h-4 w-4 fill-current" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Ofensivas de Descarte</h4>
                <p className="text-xs text-[#1a2421]/60">Ganhe medalhas virtuais mantendo sua rotina ativa semana após semana.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="mt-1 bg-green-100 text-[#7d9b76] p-1.5 rounded-lg shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Segurança e Transparência</h4>
                <p className="text-xs text-[#1a2421]/60">Acesso seguro com proteção total aos seus dados de perfil e histórico de pontuação.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#cbd6c2]/30 border border-[#a8c0a0]/30 rounded-2xl p-6 md:p-8 grid grid-cols-2 gap-3 md:gap-4 w-full">
          <div className="bg-white/80 border border-[#a8c0a0]/20 rounded-xl p-4 md:p-5 text-center transition-all">
            <Flame className="h-6 w-6 md:h-8 md:w-8 text-orange-500 mx-auto fill-current animate-pulse" />
            <h4 className="text-lg md:text-xl font-bold mt-2">
              {usuarioLogado ? `${usuarioLogado.streak || 0} Dias` : '5 Dias'}
            </h4>
            <p className="text-[10px] md:text-xs text-[#1a2421]/50">Sua Ofensiva</p>
          </div>
          <div className="bg-white/80 border border-[#a8c0a0]/20 rounded-xl p-4 md:p-5 text-center transition-all">
            <Award className="h-6 w-6 md:h-8 md:w-8 text-[#7d9b76] mx-auto" />
            <h4 className="text-lg md:text-xl font-bold mt-2">
              {usuarioLogado ? (usuarioLogado.totalPontos || 0).toLocaleString('pt-BR') : '1.250'}
            </h4>
            <p className="text-[10px] md:text-xs text-[#1a2421]/50">Pontos ECO</p>
          </div>
          <div className="bg-white/40 border border-[#a8c0a0]/10 rounded-xl p-3 md:p-4 col-span-2 text-center text-xs text-[#1a2421]/60 italic transition-all">
            {usuarioLogado ? (
              `"Mais de ${usuarioLogado.totalResiduosKg || 0}kg de resíduos reciclados até agora!"`
            ) : (
              `"Mais de 15kg de plástico e papelão reciclados este mês!"`
            )}
          </div>
        </div>
      </section>

      {isHydrated && !usuarioLogado && (
        <section className="bg-[#7d9b76] text-[#f5f0e8] py-12 md:py-16 px-4 md:px-6 text-center animate-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">Pronto para fazer parte dessa mudança?</h2>
            <p className="mt-4 text-[#f5f0e8]/80 text-sm md:text-base leading-relaxed">
              Crie sua conta agora mesmo, ganhe seus primeiros pontos de boas-vindas e agende sua primeira coleta seletiva ainda hoje.
            </p>
            <div className="mt-8">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center h-12 px-6 md:px-8 rounded-xl text-sm font-semibold bg-[#f5f0e8] text-[#7d9b76] shadow-sm hover:bg-[#eadecc] transition-colors"
              >
                Cadastrar Gratuitamente
              </Link>
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
}
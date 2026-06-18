'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/useAuthStore';
import { Leaf, Recycle, Calendar, Award, Flame, ArrowRight, Star, Store, MapPin, Box, CheckCircle } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const usuarioStore = useAuthStore((state) => state.user); 
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const usuarioLogado = isHydrated ? usuarioStore : null;

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1a2421] font-sans flex flex-col relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#e3ebd6] to-transparent -z-10"></div>

      {isHydrated && !usuarioLogado && (
        <header className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center transition-opacity animate-in fade-in">
          <div className="flex items-center gap-2 font-heading font-black text-xl tracking-tight text-[#7d9b76]">
            <Leaf className="h-6 w-6" /> EcoCiclo
          </div>
          <div className="flex items-center gap-4">
            <Link href="/parceiro/login" className="hidden sm:block text-xs font-bold text-[#1a2421]/60 hover:text-[#7d9b76] uppercase tracking-widest transition-colors">
              Para Empresas
            </Link>
            <button 
              onClick={() => router.push('/login')}
              className="px-6 py-2.5 rounded-full text-sm font-bold border-2 border-[#7d9b76] text-[#7d9b76] hover:bg-[#7d9b76] hover:text-[#f5f0e8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Entrar
            </button>
          </div>
        </header>
      )}
      
      <section className="relative px-4 md:px-6 py-12 md:py-24 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left animate-in slide-in-from-left-8 duration-1000">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-[#7d9b76] text-xs font-bold mb-6 border border-[#a8c0a0]/30">
            <Star className="h-3.5 w-3.5 fill-current text-yellow-500" /> A plataforma nº1 em sustentabilidade
          </span>
          
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#1a2421]">
            Transforme os seus resíduos em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a7654] to-[#8eb386]">recompensas</span> reais.
          </h1>
          
          <p className="mt-6 text-base md:text-lg text-[#1a2421]/70 max-w-xl leading-relaxed font-medium">
            Agende descartes com facilidade, acumule pontos ECO por cada quilo reciclado e troque por descontos exclusivos nos nossos parceiros.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/register" 
              className="flex items-center justify-center gap-2 h-14 px-8 rounded-2xl text-base font-bold bg-[#7d9b76] text-white shadow-lg shadow-[#7d9b76]/30 hover:bg-[#63805d] hover:scale-105 transition-all duration-300"
            >
              Começar Agora <ArrowRight className="h-5 w-5" />
            </Link>
            
            <Link 
              href="#como-funciona"
              className="flex items-center justify-center h-14 px-8 rounded-2xl text-base font-bold bg-white text-[#1a2421] border border-[#a8c0a0]/30 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Como Funciona?
            </Link>
          </div>
        </div>

        <div className="relative animate-in slide-in-from-right-8 duration-1000 hidden md:block">
          <div className="absolute -left-8 top-12 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Impacto Gerado</p>
              <p className="text-sm font-black text-gray-900">+10.000 kg</p>
            </div>
          </div>

          <div className="absolute -right-4 bottom-24 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
              <Flame className="h-5 w-5 fill-current" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Ofensiva Ativa</p>
              <p className="text-sm font-black text-gray-900">32 Dias</p>
            </div>
          </div>

          <div className="relative w-full aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7d9b76] to-[#dce5d4] rounded-[3rem] rotate-6 opacity-50 scale-105 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop" 
              alt="Pessoa separando lixo reciclável" 
              className="w-full h-full object-cover rounded-[3rem] shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white py-20 md:py-32 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-[#1a2421]">O ciclo sustentável em 3 passos</h2>
            <p className="mt-4 text-base text-[#1a2421]/60 font-medium max-w-2xl mx-auto">É simples, rápido e benéfico para todos. Veja como transformar o seu lixo em valor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-[#f5f0e8]/50 border border-[#a8c0a0]/20 rounded-[2.5rem] p-8 md:p-10 hover:bg-[#dce5d4]/40 hover:-translate-y-2 transition-all duration-500">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-[#7d9b76]">
                <Calendar className="h-8 w-8 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a2421]">1. Marcar Agendamento</h3>
              <p className="text-base text-[#1a2421]/70 leading-relaxed">
                Acesse a aba de agendamentos, escolha o Ecoponto mais próximo, defina o material e reserve o seu horário.
              </p>
            </div>

            <div className="group bg-[#f5f0e8]/50 border border-[#a8c0a0]/20 rounded-[2.5rem] p-8 md:p-10 hover:bg-[#dce5d4]/40 hover:-translate-y-2 transition-all duration-500">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-[#7d9b76]">
                <Recycle className="h-8 w-8 group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a2421]">2. Descarte Inteligente</h3>
              <p className="text-base text-[#1a2421]/70 leading-relaxed">
                Leve o seu material ao ponto no horário marcado. Os nossos parceiros farão a validação digital do seu descarte diretamente no sistema.
              </p>
            </div>

            <div className="group bg-[#f5f0e8]/50 border border-[#a8c0a0]/20 rounded-[2.5rem] p-8 md:p-10 hover:bg-[#dce5d4]/40 hover:-translate-y-2 transition-all duration-500">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-[#7d9b76]">
                <Award className="h-8 w-8 group-hover:scale-110 group-hover:text-yellow-500 transition-all duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a2421]">3. Resgate Prêmios</h3>
              <p className="text-base text-[#1a2421]/70 leading-relaxed">
                O peso do material vira Pontos ECO. Troque o seu saldo por cupons de desconto em supermercados, transportes e muito mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5f0e8] border-t border-[#a8c0a0]/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-[#7d9b76] text-xs font-black uppercase tracking-widest mb-2 block">Rede de Ecopontos</span>
          <h2 className="text-3xl font-black text-[#1a2421] mb-10">Empresas que confiam no EcoCiclo</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[#a8c0a0]/20 hover:border-[#7d9b76] transition-all cursor-pointer shadow-sm h-32 hover:scale-105">
              <img src="https://logo.clearbit.com/natura.com.br" alt="Natura" className="h-10 object-contain mb-3" />
              <span className="font-black text-[10px] text-[#1a2421] tracking-wider uppercase">Natura</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[#a8c0a0]/20 hover:border-[#7d9b76] transition-all cursor-pointer shadow-sm h-32 hover:scale-105">
              <img src="https://logo.clearbit.com/carrefour.com.br" alt="Carrefour" className="h-10 object-contain mb-3" />
              <span className="font-black text-[10px] text-[#1a2421] tracking-wider uppercase">Carrefour</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[#a8c0a0]/20 hover:border-[#7d9b76] transition-all cursor-pointer shadow-sm h-32 hover:scale-105">
              <img src="https://logo.clearbit.com/ambev.com.br" alt="Ambev" className="h-10 object-contain mb-3" />
              <span className="font-black text-[10px] text-[#1a2421] tracking-wider uppercase">Ambev Logística</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[#a8c0a0]/20 hover:border-[#7d9b76] transition-all cursor-pointer shadow-sm h-32 hover:scale-105">
              <img src="https://logo.clearbit.com/br.ifood.com" alt="iFood" className="h-10 object-contain mb-3" />
              <span className="font-black text-[10px] text-[#1a2421] tracking-wider uppercase">iFood Sustentável</span>
            </div>
          </div>
          
          <div className="mt-10">
            <Link href="/parceiro/login" className="text-sm font-bold text-[#7d9b76] hover:text-[#5a7654] transition-colors underline underline-offset-4">
              Aceder ao Portal Operacional do Parceiro &rarr;
            </Link>
          </div>
        </div>
      </section>

      {isHydrated && !usuarioLogado && (
        <section className="bg-[#1a2421] py-20 md:py-28 px-4 md:px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-[#7d9b76]/20 to-transparent blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Pronto para impactar o mundo?</h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium mb-10">
              Junte-se a milhares de pessoas que já transformaram o lixo numa moeda de troca valiosa. O cadastro demora menos de 1 minuto.
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center h-16 px-10 rounded-full text-lg font-bold bg-[#7d9b76] text-white shadow-2xl hover:bg-[#63805d] hover:scale-105 transition-all duration-300"
            >
              Criar Conta Gratuita Agora
            </Link>
          </div>
        </section>
      )}
      
    </div>
  );
}
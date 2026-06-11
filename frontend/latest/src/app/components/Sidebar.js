'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  User, 
  Calendar, 
  MapPin, 
  Award, 
  Flame, 
  LogOut,
  Trophy
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";
import useSWR from 'swr';

const API_URL = 'https://eco-ciclo-pfe-poo-aps-backend.onrender.com';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Erro ao buscar dados');
  return res.json();
});

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const usuario = useAuthStore((state) => state.user);
  const logoutGlobal = useAuthStore((state) => state.logout);

  const { data: rankingGlobal = [] } = useSWR(
    `${API_URL}/api/usuarios/ranking`,
    fetcher,
    { refreshInterval: 5000 }
  );

  const formatarNome = (txt) => {
    if (!txt) return "";
    return txt.toLowerCase().split(" ").map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1)).join(" ");
  };

  const handleLogout = () => {
    logoutGlobal();
    toast.success("Sessão encerrada com sucesso.");
    router.push("/"); 
  };

  const menuItems = [
    {
      title: "Meu Perfil",
      href: "/profile",
      icon: User,
      description: "Dados e configurações"
    },
    {
      title: "Agendar Coleta",
      href: "/form",
      icon: Calendar,
      description: "Marcar novos descartes"
    },
    {
      title: "Pontos de Coleta",
      href: "/pontos-de-coleta",
      icon: MapPin,
      description: "Locais parceiros próximos"
    },
    {
      title: "Minhas Recompensas",
      href: "/rewards",
      icon: Award,
      description: "Resgatar prêmios e cupons"
    },
  ];

  const rankColors = [
    "bg-amber-100/70 text-amber-700 border-amber-200", 
    "bg-slate-100/70 text-slate-600 border-slate-200", 
    "bg-orange-50/80 text-orange-800 border-orange-200"  
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] bg-[#f5f0e8] border-r border-[#a8c0a0]/20 flex flex-col justify-between p-4 font-sans sticky top-16 overflow-y-auto custom-scrollbar">
      
      <div className="space-y-6">
        
        {usuario && (
          <div className="bg-[#dce5d4]/40 border border-[#a8c0a0]/30 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs text-[#1a2421]/50 font-medium">Seus Pontos</span>
              <span className="text-lg font-bold text-[#7d9b76] leading-none mt-1">
                {usuario.totalPontos || 0} <span className="text-xs font-normal text-[#1a2421]/60">ECO</span>
              </span>
            </div>
            <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-lg" title="Dias de Ofensiva Ativa">
              <Flame className="h-4 w-4 fill-current animate-pulse" />
              <span className="text-xs font-bold">{usuario.streak || 0}d</span>
            </div>
          </div>
        )}

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-[#7d9b76] text-[#f5f0e8] shadow-sm"
                    : "text-[#1a2421]/70 hover:bg-[#dce5d4]/50 hover:text-[#7d9b76]"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-[#f5f0e8]" : "text-[#7d9b76] group-hover:scale-105 transition-transform"}`} />
                <div className="flex flex-col min-w-0">
                  <span className="truncate leading-normal">{item.title}</span>
                  <span className={`text-[10px] font-normal truncate leading-none mt-0.5 ${isActive ? "text-[#f5f0e8]/70" : "text-[#1a2421]/40"}`}>
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-4 border-t border-[#a8c0a0]/20">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-[#1a2421]/40 mb-3 flex items-center gap-2 px-2">
            <Trophy className="h-3.5 w-3.5 text-amber-500" /> Top 3 Recicladores
          </h3>
          
          <div className="space-y-2">
            {rankingGlobal.length === 0 ? (
              <p className="text-[10px] text-gray-400 text-center py-2 italic">Calculando...</p>
            ) : (
              rankingGlobal.map((user, index) => (
                <div key={user.id} className={`flex items-center justify-between p-2 rounded-xl border ${rankColors[index]} transition-all shadow-sm`}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex items-center justify-center w-5 h-5 font-black text-[10px] rounded-full bg-white/60 shadow-sm shrink-0">
                      {index + 1}º
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold leading-tight truncate">
                        {formatarNome(user.nome).split(" ")[0]}
                      </span>
                      <span className="text-[9px] opacity-70 truncate">
                        {usuario && user.id === usuario.id ? "(Você)" : "Comunidade"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-bold shrink-0">
                    <Flame className="h-3 w-3 fill-current" />
                    <span className="text-xs">{user.streak || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </aside>
  );
}
'use client';

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Leaf, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const usuario = useAuthStore((state) => state.user);
  const logoutGlobal = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logoutGlobal();
    toast.success("Sessão encerrada.");
    router.push("/"); 
  };

  const isLoginPage = pathname === '/login';

  return (
    <nav className="w-full h-20 bg-[#f5f0e8]/80 backdrop-blur-md border-b border-[#a8c0a0]/30 px-4 md:px-12 flex items-center justify-between font-sans sticky top-0 z-50 transition-all duration-300">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7d9b76] to-[#5a7654] text-white shadow-md group-hover:scale-105 transition-transform">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="font-heading text-xl font-black tracking-tight text-[#1a2421]">
          EcoCiclo
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {!usuario ? (
          !isLoginPage && (
            <button
              onClick={() => router.push('/login')}
              className="px-5 py-2.5 rounded-full text-sm font-bold bg-white text-[#1a2421] border border-[#a8c0a0]/40 shadow-sm hover:border-[#7d9b76] hover:text-[#7d9b76] transition-all"
            >
              Entrar
            </button>
          )
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#1a2421]/70 font-medium hidden sm:inline-flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-[#a8c0a0]/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Olá, <strong className="text-[#1a2421]">{usuario.nome?.split(' ')[0] || "Usuário"}</strong>
            </span>
            <button
              onClick={handleLogout}
              title="Sair da Conta"
              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-colors group"
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
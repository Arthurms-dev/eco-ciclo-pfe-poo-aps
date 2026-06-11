'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; 
import { useAuthStore } from "../store/useAuthStore";
import { Toaster } from "sonner";

import { Providers } from "./providers"; 
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import AuthGuard from "./components/AuthGuard"; 
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const usuario = useAuthStore((state) => state.user);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  const rotasDeAutenticacao = ['/login', '/register'];
  const rotasPublicas = ['/', '/termos', '/privacidade'];
  const ehRotaPublicaSimples = rotasPublicas.includes(pathname);
  const mostraBarrasDoSistema = montado && !rotasDeAutenticacao.includes(pathname) && (!ehRotaPublicaSimples || !!usuario);
  const mostraFooter = montado && !rotasDeAutenticacao.includes(pathname);

  return (
    <html lang="pt-BR">
      <body className={`min-h-screen flex flex-col bg-[#f5f0e8] antialiased text-[#1a2421] ${!montado ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
        <Providers>
          <AuthGuard>
            <Toaster position="top-right" richColors />

            {mostraBarrasDoSistema && <Navbar />}

            <div className="flex flex-1">
              {mostraBarrasDoSistema && <Sidebar />}

              <main className="flex-1 w-full">
                {children}
              </main>
            </div>

            {mostraFooter && <Footer />}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
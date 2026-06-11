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
  const isAuthPage = rotasDeAutenticacao.includes(pathname);
  const rotasDeAutenticacao = ['/login', '/register'];
  const rotasPublicas = ['/', '/termos', '/privacidade'];
  const ehRotaPublicaSimples = rotasPublicas.includes(pathname);
  const mostraBarrasDoSistema = montado && !isAuthPage;
  const mostraFooter = montado && !isAuthPage;

return (
    <html lang="pt-BR">
      <body className={`min-h-screen flex flex-col bg-[#f5f0e8] ...`}>
        <Providers>
          {isAuthPage ? (
            <main>{children}</main>
          ) : (
            <AuthGuard>
               <Toaster position="top-right" richColors />
               {mostraBarrasDoSistema && <Navbar />}
               <div className="flex flex-1">
                 {mostraBarrasDoSistema && <Sidebar />}
                 <main className="flex-1 w-full">{children}</main>
               </div>
               {mostraFooter && <Footer />}
            </AuthGuard>
          )}
        </Providers>
      </body>
    </html>
  );
}
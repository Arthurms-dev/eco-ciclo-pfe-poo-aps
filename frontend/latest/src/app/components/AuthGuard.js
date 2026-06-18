'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const usuario = useAuthStore((state) => state.user);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  const rotasPublicas = ['/', '/login', '/register', '/Termos', '/Privacidade', '/parceiro/login'];
  const ehRotaPublica = rotasPublicas.includes(pathname);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!usuario && !ehRotaPublica) {
      router.replace('/login');
    }

    if (usuario && (pathname === '/login' || pathname === '/register')) {
      router.replace('/profile');
    }
  }, [usuario, pathname, isHydrated, router, ehRotaPublica]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7d9b76]"></div>
      </div>
    );
  }

  if (!usuario && !ehRotaPublica) {
    return null; 
  }

  return <>{children}</>;
}
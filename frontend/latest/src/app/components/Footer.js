'use client';

import * as React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f5f0e8] border-t border-[#a8c0a0]/20 py-8 px-6 md:px-12 font-sans mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2 opacity-70">
          <Leaf className="h-4 w-4 text-[#7d9b76]" />
          <span className="text-xs font-bold tracking-tight text-[#1a2421]">EcoCiclo</span>
          <span className="text-xs text-[#1a2421]/50">| © {new Date().getFullYear()}</span>
        </div>

        <div className="flex gap-6 text-xs text-[#1a2421]/60">
          <Link href="/Termos" className="hover:text-[#7d9b76] hover:underline transition-colors">
            Termos de Uso
          </Link>
          <Link href="/Privacidade" className="hover:text-[#7d9b76] hover:underline transition-colors">
            Privacidade
          </Link>
          <a 
            href="https://github.com/Arthurms-dev/eco-ciclo-pfe-poo-aps.git" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#7d9b76] hover:underline transition-colors"
          >
            GitHub do Projeto
          </a>
        </div>
        
      </div>
    </footer>
  );
}
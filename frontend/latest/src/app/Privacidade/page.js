import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[#7d9b76] font-bold hover:text-[#5a7654] transition-colors">
          <ArrowLeft size={20} /> Voltar ao Início
        </Link>
      </div>
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl border border-[#a8c0a0]/30 shadow-xl p-8 md:p-12 text-[#1a2421]">
        
        <div className="border-b border-[#a8c0a0]/20 pb-6 mb-8 text-center sm:text-left">
          <p className="text-xs font-semibold text-[#7d9b76] uppercase tracking-widest mb-1">
            EcoCiclo Plataforma
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1a2421]">
            Política de Privacidade
          </h1>
          <p className="text-xs text-gray-400 mt-2">
            Última atualização: Junho de 2026
          </p>
        </div>
        <div className="space-y-6 text-sm leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1a2421]">
              1. Informações que Recolhemos
            </h2>
            <p>
              A nossa plataforma recolhe apenas os dados estritamente necessários para viabilizar a gestão do perfil e a logística de descarte ecológico. Isto inclui o seu nome, endereço de e-mail e as coordenadas geográficas ou moradas utilizadas para definir o ponto de recolha dos resíduos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1a2421]">
              2. Utilização dos Dados Pessoais
            </h2>
            <p>
              Os dados recolhidos são utilizados exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Processar os agendamentos de recolha junto dos operadores;</li>
              <li>Calcular o volume acumulado de resíduos reciclados e atualizar o ranking comunitário;</li>
              <li>Gerir o saldo de recompensas e a validação de cupons na loja interna.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1a2421]">
              3. Partilha de Informação
            </h2>
            <p>
              O EcoCiclo não vende, aluga ou comercializa os dados pessoais dos seus utilizadores com terceiros. As informações de endereço e volume de descarte são transmitidas de forma restrita aos operadores responsáveis pela manutenção logística dos contentores de recolha e pelo camião de simulação.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1a2421]">
              4. Segurança e Retenção
            </h2>
            <p>
              Implementamos salvaguardas de infraestrutura eletrónica para proteger os dados armazenados contra acessos não autorizados. Os dados permanecem ativos enquanto a conta do utilizador existir na base de dados, sendo completamente expurgados em caso de exclusão definitiva do perfil.
            </p>
          </section>
        </div>
        <div className="border-t border-[#a8c0a0]/20 mt-10 pt-6 text-center text-xs text-gray-400">
          A proteção dos seus dados é um pilar fundamental da nossa operação sustentável.
        </div>

      </div>
    </div>
  );
}
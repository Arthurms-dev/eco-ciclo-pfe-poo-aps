export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl border border-[#a8c0a0]/30 shadow-xl p-8 md:p-12 text-[#1a2421] transform transition-all">
        
        <div className="border-b border-[#a8c0a0]/20 pb-6 mb-8 text-center sm:text-left">
          <p className="text-xs font-semibold text-[#7d9b76] uppercase tracking-widest mb-1">
            EcoCiclo Plataforma
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1a2421]">
            Termos de Uso e Serviço
          </h1>
          <p className="text-xs text-gray-400 mt-2">
            Última atualização: Junho de 2026
          </p>
        </div>
        <div className="space-y-6 text-sm leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1a2421] flex items-center gap-2">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao aceder e utilizar a plataforma **EcoCiclo**, o utilizador concorda expressamente em cumprir e vincular-se aos presentes Termos de Uso. Estes termos regem o agendamento de recolhas, a atribuição de pontuações e a interação com os pontos de descarte. Se não concordar com alguma destas diretrizes, recomendamos que interrompa a utilização dos nossos serviços.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1a2421]">
              2. Responsabilidades do Utilizador
            </h2>
            <p>
              O utilizador compromete-se a fornecer informações verdadeiras e exatas no momento do registo e ao efetuar um agendamento de recolha (como peso estimado e tipo de resíduo). 
            </p>
            <p className="bg-amber-50/50 border-l-4 border-amber-500/50 p-3 rounded-r-xl text-xs text-amber-900">
              <strong>Aviso Importante:</strong> O descarte de materiais perigosos ou não catalogados deve seguir estritamente as normas ambientais vigentes e as orientações específicas exibidas em cada ponto de recolha.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1a2421]">
              3. Sistema de Pontuação (Pontos ECO)
            </h2>
            <p>
              Os Pontos ECO são concedidos como um benefício de incentivo à reciclagem física e correta. A plataforma utiliza algoritmos para validar a regularidade das entregas. Tentativas de manipulação de dados, agendamentos fraudulentos sequenciais ou simulações repetidas com o intuito de inflar artificialmente o saldo resultarão na perda integral dos pontos acumulados e na possível suspensão da conta.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1a2421]">
              4. Cancelamento de Agendamentos
            </h2>
            <p>
              O cancelamento de qualquer recolha antes do horário estipulado é permitido. No entanto, o sistema aplicará de forma automática a reversão dos pontos e a penalização adequada caso seja detetado um comportamento inconsistente com a nossa política anti-fraude.
            </p>
          </section>
        </div>
        <div className="border-t border-[#a8c0a0]/20 mt-10 pt-6 text-center text-xs text-gray-400">
          Dúvidas sobre os nossos termos? Entre em contacto com o suporte do grupo.
        </div>

      </div>
    </div>
  );
}
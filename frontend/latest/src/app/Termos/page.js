export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] p-8 md:p-16 text-[#1a2421]">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold font-heading">Termos de Uso</h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold">1. Aceitação dos Termos</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Ao utilizar a plataforma EcoCiclo, você concorda em cumprir estes termos. Se não concordar com alguma parte deles, por favor, não utilize nossos serviços.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">2. Responsabilidade do Usuário</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Você é responsável por manter a segurança da sua conta e pela veracidade das informações fornecidas ao agendar coletas. O descarte de materiais perigosos deve seguir estritamente as diretrizes informadas na plataforma.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">3. Pontuação e Recompensas</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Os Pontos ECO são um benefício concedido pelo uso do serviço. Reservamo-nos o direito de ajustar as regras de pontuação ou descontinuar parceiros de recompensas mediante aviso prévio.
          </p>
        </section>
      </div>
    </div>
  );
}
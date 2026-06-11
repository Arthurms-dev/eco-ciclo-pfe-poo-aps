export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] p-8 md:p-16 text-[#1a2421]">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold font-heading">Política de Privacidade</h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold">1. Coleta de Dados</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Coletamos apenas as informações necessárias para o funcionamento do serviço, como nome, e-mail e endereço para coletas. Estes dados são usados exclusivamente para a execução logística e gestão de recompensas.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">2. Compartilhamento</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Não vendemos ou alugamos seus dados pessoais. Podemos compartilhar informações estritamente necessárias com nossos parceiros de logística apenas para viabilizar a coleta agendada.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">3. Segurança</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Empregamos medidas de segurança para proteger suas informações, garantindo que o acesso aos dados seja restrito e utilizado de forma ética.
          </p>
        </section>
      </div>
    </div>
  );
}
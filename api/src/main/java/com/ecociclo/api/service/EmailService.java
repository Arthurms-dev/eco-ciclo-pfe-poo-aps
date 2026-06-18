package com.ecociclo.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String emailRemetente;

    public void enviarEmailAgendamento(String emailDestino, String nome, LocalDateTime dataHora, String local, int pontosProjetados) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setFrom(emailRemetente);
            
            helper.setTo(emailDestino);
            helper.setSubject("♻️ EcoCiclo - O seu descarte foi agendado!");

            String dataFormatada = dataHora.format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm"));

            String htmlTemplate = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f0e8; padding: 30px; border-radius: 15px; color: #1a2421;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #7d9b76; margin: 0;">EcoCiclo</h1>
                        <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #a8c0a0; margin: 0;">Logística Reversa</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <h2 style="margin-top: 0;">Olá, %s! 👋</h2>
                        <p style="line-height: 1.6; color: #4a5d45;">O seu agendamento de descarte inteligente foi confirmado com sucesso. O meio ambiente agradece a sua iniciativa!</p>
                        
                        <div style="background-color: #f8faf7; border-left: 4px solid #7d9b76; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                            <p style="margin: 5px 0;"><strong>📍 Local:</strong> %s</p>
                            <p style="margin: 5px 0;"><strong>📅 Data e Hora:</strong> %s</p>
                        </div>
                        
                        <div style="text-align: center; background: linear-gradient(135deg, #7d9b76, #516b4c); padding: 20px; border-radius: 10px; color: white; margin-top: 25px;">
                            <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Pontos Projetados Reservados</p>
                            <h1 style="margin: 10px 0 0 0; font-size: 36px;">+%d ECO</h1>
                        </div>
                        
                        <p style="font-size: 13px; color: #888; text-align: center; margin-top: 20px; line-height: 1.5;">
                            <em>Estes pontos estão pendentes na sua carteira. Eles serão libertados e adicionados ao seu saldo oficial assim que concluir o descarte no Ecoponto!</em>
                        </p>
                    </div>
                    
                    <p style="text-align: center; font-size: 12px; color: #a8c0a0; margin-top: 20px;">
                        © 2026 EcoCiclo. Juntos por um futuro sustentável.
                    </p>
                </div>
                """.formatted(nome.split(" ")[0], local, dataFormatada, pontosProjetados);

            helper.setText(htmlTemplate, true);
            mailSender.send(mensagem);

        } catch (MessagingException e) {

            System.err.println("Erro ao enviar e-mail B2C: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void enviarEmailParaEmpresa(String emailEmpresa, String nomeEmpresa, String nomeCidadao, LocalDateTime dataHora, Double quantidade, String unidadeMedida, String tipoResiduo) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setFrom(emailRemetente);
            
            helper.setTo(emailEmpresa);
            helper.setSubject("🔔 Alerta Logístico: Novo recebimento agendado (" + dataHora.format(DateTimeFormatter.ofPattern("dd/MM")) + ")");

            String dataFormatada = dataHora.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            String horaFormatada = dataHora.format(DateTimeFormatter.ofPattern("HH:mm"));

            String htmlTemplate = """
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111815; padding: 30px; border-radius: 8px; color: #ffffff;">
                    <div style="border-bottom: 1px solid #2d3a35; padding-bottom: 20px; margin-bottom: 25px;">
                        <span style="background-color: #7d9b76; color: #ffffff; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 4px 8px; border-radius: 4px;">Portal do Parceiro ECO</span>
                        <h2 style="margin: 15px 0 0 0; font-weight: 300; color: #f5f0e8;">Aviso de Recebimento de Carga</h2>
                    </div>
                    
                    <p style="color: #a8c0a0; font-size: 15px;">Olá, equipe <strong>%s</strong>,</p>
                    <p style="color: #dce5d4; font-size: 14px; line-height: 1.6;">Um novo agendamento de descarte foi realizado na vossa unidade. Por favor, preparem a área de triagem para a seguinte carga:</p>
                    
                    <div style="background-color: #1a2421; border: 1px solid #3a4a44; border-radius: 8px; padding: 20px; margin: 25px 0;">
                        <table style="width: 100%%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #889985; font-size: 12px; text-transform: uppercase;">Cidadão:</td>
                                <td style="padding: 8px 0; color: #ffffff; font-weight: bold; text-align: right;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #889985; font-size: 12px; text-transform: uppercase; border-top: 1px solid #2d3a35;">Data Esperada:</td>
                                <td style="padding: 8px 0; color: #ffffff; font-weight: bold; text-align: right; border-top: 1px solid #2d3a35;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #889985; font-size: 12px; text-transform: uppercase; border-top: 1px solid #2d3a35;">Slot de Horário:</td>
                                <td style="padding: 8px 0; color: #ffffff; font-weight: bold; text-align: right; border-top: 1px solid #2d3a35;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0 0 0; color: #889985; font-size: 12px; text-transform: uppercase; border-top: 1px solid #2d3a35;">Volume Declarado:</td>
                                <td style="padding: 12px 0 0 0; color: #7d9b76; font-size: 18px; font-weight: 900; text-align: right; border-top: 1px solid #2d3a35;">%.1f %s</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0 0 0; color: #889985; font-size: 12px; text-transform: uppercase;">Tipo de Material:</td>
                                <td style="padding: 4px 0 0 0; color: #dce5d4; font-size: 14px; font-weight: bold; text-align: right;">%s</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://ecociclo.com/parceiro/login" style="background-color: #7d9b76; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Aceder ao Portal do Parceiro</a>
                    </div>
                    
                    <p style="text-align: center; font-size: 11px; color: #5a7654; margin-top: 40px; border-top: 1px solid #2d3a35; padding-top: 15px;">
                        Este é um e-mail automático do sistema logístico EcoCiclo B2B. Não responda.
                    </p>
                </div>
                """.formatted(nomeEmpresa, nomeCidadao, dataFormatada, horaFormatada, quantidade, unidadeMedida, tipoResiduo);

            helper.setText(htmlTemplate, true);
            mailSender.send(mensagem);

        } catch (MessagingException e) {
            System.err.println("Erro ao enviar e-mail B2B: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void enviarEmailRecuperacao(String emailDestino, String nome, String novaSenha) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setFrom(emailRemetente);
            
            helper.setTo(emailDestino);
            helper.setSubject("🔒 EcoCiclo - Sua senha temporária de acesso");

            String htmlTemplate = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f0e8; padding: 30px; border-radius: 15px; color: #1a2421;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #7d9b76; margin: 0;">EcoCiclo</h1>
                        <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #a8c0a0; margin: 0;">Segurança da Conta</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <h2 style="margin-top: 0;">Solicitação de Nova Senha</h2>
                        <p style="line-height: 1.6; color: #4a5d45;">Olá, %s. Recebemos um pedido de recuperação de acesso para a sua conta. Uma senha temporária foi gerada automaticamente pelo sistema.</p>
                        
                        <div style="text-align: center; background-color: #f5f0e8; border: 2px dashed #a8c0a0; padding: 15px; margin: 25px 0; border-radius: 10px;">
                            <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: rgba(26,36,33,0.5); font-weight: bold; margin-bottom: 5px;">Sua Senha Temporária</span>
                            <code style="font-family: monospace; font-size: 24px; font-weight: bold; color: #1a2421; letter-spacing: 4px; padding: 10px; display: inline-block;">%s</code>
                        </div>
                        
                        <p style="font-size: 13px; color: #888; line-height: 1.5; text-align: center;">
                            <em>Por segurança, recomendamos que faça login utilizando este código e altere a sua senha imediatamente na aba de configurações do seu perfil.</em>
                        </p>
                    </div>
                    
                    <p style="text-align: center; font-size: 12px; color: #a8c0a0; margin-top: 20px;">
                        © 2026 EcoCiclo. Protegendo os seus dados e o planeta.
                    </p>
                </div>
                """.formatted(nome.split(" ")[0], novaSenha);

            helper.setText(htmlTemplate, true);
            mailSender.send(mensagem);

        } catch (MessagingException e) {
            System.err.println("Erro ao enviar e-mail de recuperação: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void enviarEmailSenhaAlterada(String emailDestino, String nome) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setFrom(emailRemetente);
            helper.setTo(emailDestino);
            helper.setSubject("✅ EcoCiclo - A sua senha foi atualizada!");

            String htmlTemplate = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f0e8; padding: 30px; border-radius: 15px; color: #1a2421;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #7d9b76; margin: 0;">EcoCiclo</h1>
                        <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #a8c0a0; margin: 0;">Segurança da Conta</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <h2 style="margin-top: 0;">Atualização bem-sucedida</h2>
                        <p style="line-height: 1.6; color: #4a5d45;">Olá, %s. Este e-mail serve para confirmar que a senha da sua conta EcoCiclo foi <strong>alterada com sucesso</strong> pelo painel do perfil.</p>
                        
                        <p style="font-size: 13px; color: #888; line-height: 1.5; margin-top: 20px;">
                            <em>Se você não realizou esta alteração, entre em contato com o suporte imediatamente.</em>
                        </p>
                    </div>
                    
                    <p style="text-align: center; font-size: 12px; color: #a8c0a0; margin-top: 20px;">
                        © 2026 EcoCiclo. Protegendo os seus dados e o planeta.
                    </p>
                </div>
                """.formatted(nome.split(" ")[0]);

            helper.setText(htmlTemplate, true);
            mailSender.send(mensagem);

        } catch (MessagingException e) {
            System.err.println("Erro ao enviar e-mail de confirmação de senha: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

package com.ecociclo.api.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ecociclo.api.model.Scheduling;
import com.ecociclo.api.model.StatusEnum;
import com.ecociclo.api.model.User;
import com.ecociclo.api.repository.CollectionPointRepository;
import com.ecociclo.api.repository.SchedulingRepository;
import com.ecociclo.api.repository.UserRepository;

@Component
public class AgendamentoCleanupTask {

    @Autowired
    private SchedulingRepository schedulingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollectionPointRepository collectionPointRepository;

    @Scheduled(fixedRate = 3600000)
    @Transactional
    @SuppressWarnings("null")
    public void limparAgendamentosExpirados() {
        System.out.println("🤖 [EcoCiclo-Bot] Iniciando varredura de agendamentos abandonados...");
        

        List<Scheduling> pendentes = schedulingRepository.findByStatusEnum(StatusEnum.PENDENTE);
        LocalDateTime agora = LocalDateTime.now();
        boolean houveAlteracao = false;

        for (Scheduling agendamento : pendentes) {
            if (agendamento.getDataHora() != null && agendamento.getDataHora().isBefore(agora)) {
                System.out.println("🚫 [EcoCiclo-Bot] Cancelando agendamento ID: " + agendamento.getId() + " por falta de comparecimento.");
                
                agendamento.setStatusEnum(StatusEnum.CANCELADO);
                
                User user = agendamento.getUser();
                if (user != null) {
                    int quantidade = (agendamento.getQuantidade() != null) ? agendamento.getQuantidade() : 1;
                    int pontosEstorno = quantidade * 50;
                    
                    if (agendamento.getWasteItem() != null && agendamento.getWasteItem().getId() == 1L) {
                        pontosEstorno *= 2;
                    }

                    int pendentesAtuais = user.getPontosPendentes() != null ? user.getPontosPendentes() : 0;
                    user.setPontosPendentes(Math.max(0, pendentesAtuais - pontosEstorno));
                    userRepository.save(user);
                }
                
                if (agendamento.getPontoColetaId() != null) {
                    collectionPointRepository.findById(agendamento.getPontoColetaId()).ifPresent(ponto -> {
                        double volAtual = ponto.getVolumeAtual() != null ? ponto.getVolumeAtual() : 0.0;
                        double quantidadeCancelada = agendamento.getQuantidade() != null ? agendamento.getQuantidade().doubleValue() : 0.0;
                        
                        double novoVol = volAtual - quantidadeCancelada;
                        ponto.setVolumeAtual(Math.max(0.0, Math.round(novoVol * 10.0) / 10.0));
                        collectionPointRepository.save(ponto);
                    });
                }
                
                houveAlteracao = true;
            }
        }

        if (houveAlteracao) {
            schedulingRepository.saveAll(pendentes);
            System.out.println("✅ [EcoCiclo-Bot] Faxina concluída. Banco de dados limpo e pátios virtuais liberados.");
        }
    }
}
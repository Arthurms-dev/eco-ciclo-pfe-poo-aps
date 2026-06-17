package com.ecociclo.api.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecociclo.api.dto.SchedulingDto;
import com.ecociclo.api.model.CollectionPoint;
import com.ecociclo.api.model.Scheduling;
import com.ecociclo.api.model.StatusEnum;
import com.ecociclo.api.model.User;
import com.ecociclo.api.repository.CollectionPointRepository;
import com.ecociclo.api.repository.SchedulingRepository;
import com.ecociclo.api.repository.UserRepository;
import com.ecociclo.api.repository.WasteItemRepository;

@Service
public class SchedulingService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private SchedulingRepository schedulingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WasteItemRepository wasteItemRepository;

    @Autowired
    private CollectionPointRepository collectionPointRepository;

    @Transactional 
    public Scheduling createScheduling(SchedulingDto dto) {
        LocalDateTime agoraLocal = LocalDateTime.now(ZoneId.of("America/Recife"));

        if (dto.getDataHora().isBefore(agoraLocal)) {
            throw new RuntimeException("Não é permitido criar agendamentos em datas ou horários passados.");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        CollectionPoint ponto = collectionPointRepository.findById(dto.getPontoColetaId())
                .orElseThrow(() -> new RuntimeException("Ponto de coleta não encontrado"));

        double volumeAtual = ponto.getVolumeAtual() == null ? 0.0 : ponto.getVolumeAtual();
        double novoVolume = volumeAtual + dto.getQuantidade().doubleValue();
        novoVolume = Math.round(novoVolume * 10.0) / 10.0;
        
        if (novoVolume > ponto.getCapacidadeMax()) {
            throw new RuntimeException("Este Ecoponto atingiu a capacidade máxima. Por favor, reduza o volume ou escolha outro local.");
        }
        
        ponto.setVolumeAtual(novoVolume);
        collectionPointRepository.save(ponto);

        int pontosBase = dto.getQuantidade() * 50;
        if (dto.getWasteId() != null && dto.getWasteId() == 1L) {
            pontosBase *= 2; 
        }

        user.setPontosPendentes((user.getPontosPendentes() == null ? 0 : user.getPontosPendentes()) + pontosBase);
        userRepository.save(user);

        Scheduling scheduling = new Scheduling();
        scheduling.setDataHora(dto.getDataHora());
        scheduling.setEnderecoColeta(dto.getEnderecoColeta());
        scheduling.setStatusEnum(StatusEnum.PENDENTE);
        scheduling.setUser(user);
        scheduling.setQuantidade(dto.getQuantidade());
        scheduling.setPontoColetaId(ponto.getId());

        if (dto.getWasteId() != null) {
            wasteItemRepository.findById(dto.getWasteId()).ifPresent(scheduling::setWasteItem);
        }

        Scheduling agendamentoSalvo = schedulingRepository.save(scheduling);

        int pontosFinais = pontosBase;
        new Thread(() -> {
            emailService.enviarEmailAgendamento(
                user.getEmail(), 
                user.getNome(), 
                agendamentoSalvo.getDataHora(), 
                ponto.getNomeUnidade(), 
                pontosFinais
            );
        }).start();

        return agendamentoSalvo;
    }

    public List<Scheduling> getAllSchedulings() {
        return schedulingRepository.findAll();
    }

    @Transactional
    public void delete(Long id) {
        Scheduling agendamento = schedulingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com o ID: " + id));
                
        if (agendamento.getStatusEnum() == StatusEnum.PENDENTE) {
            User user = agendamento.getUser();

            if (user != null) {
                int quantidade = (agendamento.getQuantidade() != null) ? agendamento.getQuantidade() : 1;
                int pontosGanhos = quantidade * 50;
                
                if (agendamento.getWasteItem() != null && agendamento.getWasteItem().getId() == 1L) {
                    pontosGanhos *= 2;
                }

                int pendentesAtuais = user.getPontosPendentes() != null ? user.getPontosPendentes() : 0;
                user.setPontosPendentes(Math.max(0, pendentesAtuais - pontosGanhos));
                userRepository.save(user);
            }
            
            // Liberta o espaço no Ecoponto
            if (agendamento.getPontoColetaId() != null) {
                collectionPointRepository.findById(agendamento.getPontoColetaId()).ifPresent(ponto -> {
                    double volAtual = ponto.getVolumeAtual() != null ? ponto.getVolumeAtual() : 0.0;
                    double quantidadeCancelada = agendamento.getQuantidade() != null ? agendamento.getQuantidade().doubleValue() : 0.0;
                    
                    double novoVol = volAtual - quantidadeCancelada;
                    novoVol = Math.round(novoVol * 10.0) / 10.0;
                    
                    ponto.setVolumeAtual(Math.max(0.0, novoVol));
                    collectionPointRepository.save(ponto);
                });
            }
        }

        schedulingRepository.delete(agendamento);
    }

    @Transactional
    public void concluirDescarte(Long id) {
        Scheduling agendamento = schedulingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado."));

        if (agendamento.getStatusEnum() == StatusEnum.CONCLUIDO) {
            throw new RuntimeException("Este descarte já foi concluído.");
        }

        User user = agendamento.getUser();
        int quantidade = (agendamento.getQuantidade() != null) ? agendamento.getQuantidade() : 1;
        int pontosGanhos = quantidade * 50;
        
        if (agendamento.getWasteItem() != null && agendamento.getWasteItem().getId() == 1L) {
            pontosGanhos *= 2;
        }

        int pendentesAtuais = user.getPontosPendentes() != null ? user.getPontosPendentes() : 0;
        user.setPontosPendentes(Math.max(0, pendentesAtuais - pontosGanhos));
        
        user.setTotalPontos((user.getTotalPontos() == null ? 0 : user.getTotalPontos()) + pontosGanhos);
        
        double totalKg = user.getTotalResiduosKg() != null ? user.getTotalResiduosKg() : 0.0;
        user.setTotalResiduosKg(totalKg + quantidade);
        
        int streakAtual = user.getStreak() != null ? user.getStreak() : 0;
        user.setStreak(streakAtual + 1);

        userRepository.save(user);

        agendamento.setStatusEnum(StatusEnum.CONCLUIDO);
        schedulingRepository.save(agendamento);
        
    }
}
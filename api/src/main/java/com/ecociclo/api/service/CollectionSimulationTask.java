package com.ecociclo.api.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ecociclo.api.model.CollectionPoint;
import com.ecociclo.api.repository.CollectionPointRepository;

@Component
public class CollectionSimulationTask {

    @Autowired
    private CollectionPointRepository repository;

    @Scheduled(fixedRate = 100000)
    public void simularCaminhaoDeColeta() {
        List<CollectionPoint> pontos = repository.findAll();
        if (pontos.isEmpty()) {
            return;
        }

        System.out.println("🔄 [EcoCiclo] Atualizando simulação dos Ecopontos...");
        boolean houveAlteracao = false;

        for (CollectionPoint ponto : pontos) {
            double capacidade = ponto.getCapacidadeMax() != null ? ponto.getCapacidadeMax() : 500.0;
            double volumeAtual = ponto.getVolumeAtual() != null ? ponto.getVolumeAtual() : 0.0;

            if (volumeAtual > (capacidade * 0.8)) {
                System.out.println("🚛 [EcoCiclo] Caminhão esvaziou o ponto: " + ponto.getNomeUnidade());
                ponto.setVolumeAtual(0.0);
                houveAlteracao = true;
            } else {
                double lixoAdicional = 2.0 + (Math.random() * 13.0);
                double novoVolume = volumeAtual + lixoAdicional;

                novoVolume = Math.round(novoVolume * 10.0) / 10.0;

                ponto.setVolumeAtual(Math.min(novoVolume, capacidade));
                houveAlteracao = true;
            }
        }

        if (houveAlteracao) {
            repository.saveAll(pontos);
            System.out.println("♻️ [EcoCiclo] A vida na cidade aconteceu! Volumes atualizados.");
        }
    }
}
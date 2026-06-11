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

    @Scheduled(fixedRate = 60000)
    public void simularCaminhaoDeColeta() {
        System.out.println("🚛 [EcoCiclo] O camião de recolha está a passar... Limpeza gradual!");

        List<CollectionPoint> pontos = repository.findAll();
        boolean houveAlteracao = false;
        
        for (CollectionPoint ponto : pontos) {
            if (ponto.getVolumeAtual() != null && ponto.getVolumeAtual() > 0) {
                
                double novoVolume = ponto.getVolumeAtual() - (ponto.getVolumeAtual() * 0.20);
                
                if (novoVolume < 1.0) {
                    novoVolume = 0.0;
                }
                novoVolume = Math.round(novoVolume * 10.0) / 10.0;
                
                if (novoVolume != ponto.getVolumeAtual()) {
                    ponto.setVolumeAtual(novoVolume);
                    houveAlteracao = true;
                }
            }
        }
        
        if (houveAlteracao) {
            repository.saveAll(pontos);
            System.out.println("✅ [EcoCiclo] A recolha gradual foi atualizada nos pontos!");
        } else {
            System.out.println("ℹ️ [EcoCiclo] Nenhum volume significativo para recolher neste momento.");
        }
    }
}
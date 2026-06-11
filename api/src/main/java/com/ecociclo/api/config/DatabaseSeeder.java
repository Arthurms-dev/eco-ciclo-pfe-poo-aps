package com.ecociclo.api.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ecociclo.api.model.CollectionPoint;
import com.ecociclo.api.repository.CollectionPointRepository;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private CollectionPointRepository collectionPointRepository;

    @Override
    public void run(String... args) throws Exception {
        if (collectionPointRepository.count() == 0) {
            System.out.println("🌱 [EcoCiclo] Banco de dados vazio. Criando pontos de coleta padrão em Recife...");

            CollectionPoint ponto1 = new CollectionPoint();
            ponto1.setNomeUnidade("Ecoponto Ilha do Leite"); 
            ponto1.setEndereco("Rua Francisco Alves, 100 - Ilha do Leite");
            ponto1.setLatitude(-8.0631); 
            ponto1.setLongitude(-34.8986);
            ponto1.setCapacidadeMax(500.0);
            ponto1.setVolumeAtual(100.0);
            ponto1.setTiposResiduosAceitos("Plástico, Papel, Vidro");

            CollectionPoint ponto2 = new CollectionPoint();
            ponto2.setNomeUnidade("Ecoponto Boa Viagem");
            ponto2.setEndereco("Av. Boa Viagem, 2000 - Boa Viagem");
            ponto2.setLatitude(-8.1185); 
            ponto2.setLongitude(-34.8981);
            ponto2.setCapacidadeMax(300.0);
            ponto2.setVolumeAtual(80.0);
            ponto2.setTiposResiduosAceitos("Plástico, Metal, Eletrônicos");

            CollectionPoint ponto3 = new CollectionPoint();
            ponto3.setNomeUnidade("Ecoponto Bairro do Recife");
            ponto3.setEndereco("Rua do Bom Jesus, 150 - Bairro do Recife");
            ponto3.setLatitude(-8.0617);
            ponto3.setLongitude(-34.8710);
            ponto3.setCapacidadeMax(400.0);
            ponto3.setVolumeAtual(100.0);
            ponto3.setTiposResiduosAceitos("Papel, Vidro, Óleo");

            CollectionPoint ponto4 = new CollectionPoint();
            ponto4.setNomeUnidade("Ecoponto Praça de Casa Forte");
            ponto4.setEndereco("Praça de Casa Forte, s/n - Casa Forte");
            ponto4.setLatitude(-8.0381); 
            ponto4.setLongitude(-34.9192);
            ponto4.setCapacidadeMax(600.0);
            ponto4.setVolumeAtual(250.0);
            ponto4.setTiposResiduosAceitos("Plástico, Metal, Papelão");

            CollectionPoint ponto5 = new CollectionPoint();
            ponto5.setNomeUnidade("Ecoponto CDU / UFPE");
            ponto5.setEndereco("Av. Prof. Artur de Sá, 300 - Cidade Universitária");
            ponto5.setLatitude(-8.0493); 
            ponto5.setLongitude(-34.9511);
            ponto5.setCapacidadeMax(1000.0);
            ponto5.setVolumeAtual(400.0);
            ponto5.setTiposResiduosAceitos("Eletrônicos, Baterias, Vidro");

            collectionPointRepository.saveAll(Arrays.asList(ponto1, ponto2, ponto3, ponto4, ponto5));
            
            System.out.println("✅ [EcoCiclo] 5 Pontos de coleta criados com sucesso!");
        }
    }
}
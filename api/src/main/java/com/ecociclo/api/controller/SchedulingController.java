package com.ecociclo.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecociclo.api.dto.SchedulingDto;
import com.ecociclo.api.model.Scheduling;
import com.ecociclo.api.model.StatusEnum;
import com.ecociclo.api.repository.SchedulingRepository;
import com.ecociclo.api.service.SchedulingService;

@RestController
@RequestMapping("/api/agendamentos") 
@CrossOrigin(origins = "*")
public class SchedulingController {

    @Autowired
    private SchedulingService schedulingService;

    @Autowired
    private SchedulingRepository schedulingRepository;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody SchedulingDto dto) {
        try {
            Scheduling newScheduling = schedulingService.createScheduling(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(newScheduling);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Falha interna: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/concluir")
    public ResponseEntity<String> concluirAgendamento(@PathVariable Long id) {
        schedulingService.concluirDescarte(id);
        return ResponseEntity.ok("Descarte concluído com sucesso! Pontos creditados.");
    }

    @GetMapping
    public ResponseEntity<List<Scheduling>> getHistory() {
        List<Scheduling> history = schedulingService.getAllSchedulings();
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/pendentes")
    public ResponseEntity<List<Scheduling>> getPendentes() {
        List<Scheduling> pendentes = schedulingRepository.findByStatusEnum(StatusEnum.PENDENTE);
        return ResponseEntity.ok(pendentes);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduling(@PathVariable Long id) {
        try {
            schedulingService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
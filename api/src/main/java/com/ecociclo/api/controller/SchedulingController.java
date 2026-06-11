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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecociclo.api.dto.SchedulingDto;
import com.ecociclo.api.model.Scheduling;
import com.ecociclo.api.service.SchedulingService;

@RestController
@RequestMapping("/api/agendamentos") 
@CrossOrigin(origins = "*")
public class SchedulingController {

    @Autowired
    private SchedulingService schedulingService;

    @PostMapping
    public ResponseEntity<Scheduling> create(@RequestBody SchedulingDto dto) {
        try {
            Scheduling newScheduling = schedulingService.createScheduling(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(newScheduling);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Scheduling>> getHistory() {
        List<Scheduling> history = schedulingService.getAllSchedulings();
        return ResponseEntity.ok(history);
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
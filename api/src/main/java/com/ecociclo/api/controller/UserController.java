package com.ecociclo.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.ecociclo.api.dto.UserResponseDTO;
import com.ecociclo.api.model.User;
import com.ecociclo.api.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") 
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping
    public ResponseEntity<UserResponseDTO> criar(@Valid @RequestBody User user) {
        return ResponseEntity.status(201).body(service.cadastrar(user));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> logar(@RequestBody User dadosLogin) {
        return service.buscarPorEmail(dadosLogin.getEmail())
            .map(usuario -> {
                if (usuario.getSenha().equals(dadosLogin.getSenha())) {
                    return ResponseEntity.ok(new UserResponseDTO(usuario));
                }
                return ResponseEntity.status(401).body("Senha incorreta.");
            })
            .orElse(ResponseEntity.status(404).body("Usuário não encontrado."));
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<UserResponseDTO>> obterRanking() {
        return ResponseEntity.ok(service.listarTop3Ranking());
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(new UserResponseDTO(service.buscarPorId(id)));
    }
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> atualizar(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(service.atualizar(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
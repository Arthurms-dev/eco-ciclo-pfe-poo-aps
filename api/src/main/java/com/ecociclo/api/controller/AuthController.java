package com.ecociclo.api.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecociclo.api.model.User;
import com.ecociclo.api.repository.UserRepository;
import com.ecociclo.api.service.EmailService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado no sistema."));

        String senhaTemporaria = UUID.randomUUID().toString().substring(0, 8);

        user.setSenha(passwordEncoder.encode(senhaTemporaria)); 
        userRepository.save(user);

        new Thread(() -> {
            emailService.enviarEmailRecuperacao(user.getEmail(), user.getNome(), senhaTemporaria);
        }).start();

        return ResponseEntity.ok(Map.of("mensagem", "E-mail de recuperação enviado com sucesso!"));
    }
}
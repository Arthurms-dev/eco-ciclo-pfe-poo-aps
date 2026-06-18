package com.ecociclo.api.controller;

import java.util.Map;
import com.ecociclo.api.service.EmailService;
import java.util.Date;
import java.util.List;

import java.sql.Connection;
import java.sql.Statement;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.ecociclo.api.dto.LoginResponseDTO;
import com.ecociclo.api.dto.UserResponseDTO;
import com.ecociclo.api.model.User;
import com.ecociclo.api.service.UserService;
import com.ecociclo.api.repository.CollectionPointRepository;
import com.ecociclo.api.repository.SchedulingRepository;
import com.ecociclo.api.repository.UserRepository;
import com.ecociclo.api.repository.WasteItemRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") 
public class UserController {
    @Autowired
    private DataSource dataSource;
    @Autowired
    private UserService service;

    @Autowired private EmailService emailService;
    @Autowired private SchedulingRepository schedulingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CollectionPointRepository collectionPointRepository;
    @Autowired private WasteItemRepository wasteItemRepository;

    @PostMapping
    public ResponseEntity<UserResponseDTO> criar(@Valid @RequestBody User user) {
        return ResponseEntity.status(201).body(service.cadastrar(user));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> logar(@RequestBody User dadosLogin) {
        return service.buscarPorEmail(dadosLogin.getEmail())
            .map(usuario -> {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                
                if (encoder.matches(dadosLogin.getSenha(), usuario.getSenha())) {
                    
                    Algorithm algorithm = Algorithm.HMAC256("chavesecreta-ecociclo-2026");
                    String token = JWT.create()
                            .withIssuer("ecociclo-api")
                            .withSubject(usuario.getEmail())
                            .withExpiresAt(new Date(System.currentTimeMillis() + 86400000))
                            .sign(algorithm);
                    
                    return ResponseEntity.ok(new LoginResponseDTO(new UserResponseDTO(usuario), token));
                }
                return ResponseEntity.status(401).body("{\"mensagem\": \"Senha incorreta.\"}");
            })
            .orElse(ResponseEntity.status(404).body("{\"mensagem\": \"Usuário não encontrado.\"}"));
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
    @PutMapping("/{id}/senha")
    public ResponseEntity<?> alterarSenhaPerfil(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return userRepository.findById(id).map(user -> {
            String novaSenha = request.get("senha");
            
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            user.setSenha(encoder.encode(novaSenha));
            
            userRepository.save(user);

            new Thread(() -> {
                emailService.enviarEmailSenhaAlterada(user.getEmail(), user.getNome());
            }).start();

            return ResponseEntity.ok("{\"mensagem\": \"Senha alterada com sucesso!\"}");
        }).orElse(ResponseEntity.status(404).body("{\"mensagem\": \"Usuário não encontrado.\"}"));
    }
    @DeleteMapping("/reset-database")
public ResponseEntity<String> resetDatabase() {
    
   
    try (Connection connection = dataSource.getConnection();
         Statement statement = connection.createStatement()) {

    
        String sql = "TRUNCATE TABLE tb_scheduling, tb_waste_item, tb_reward, tb_collection_point, tb_user CASCADE;";
        
        statement.execute(sql);

        return ResponseEntity.ok("Banco de dados limpo com sucesso (TRUNCATE).");

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao resetar o banco de dados: " + e.getMessage());
    } } }
package com.ecociclo.api.service;

import java.util.List;
import java.util.Optional; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecociclo.api.dto.UserResponseDTO;
import com.ecociclo.api.model.User;
import com.ecociclo.api.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserResponseDTO cadastrar(User user) {
        if(repository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        // Encriptar a senha antes de salvar!
        user.setSenha(passwordEncoder.encode(user.getSenha()));

        if (user.getStreak() == null) user.setStreak(0);
        if (user.getTotalPontos() == null) user.setTotalPontos(0);
        if (user.getTotalResiduosKg() == null) user.setTotalResiduosKg(0.0);

        User salvo = repository.save(user);
        return new UserResponseDTO(salvo);
    }

    public Optional<User> buscarPorEmail(String email) {
        return repository.findByEmail(email);
    }

    public List<UserResponseDTO> listarTodos() {
        return repository.findAll().stream().map(UserResponseDTO::new).toList();
    }

    public User buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
    }

    public UserResponseDTO atualizar(Long id, User userAtualizado) {
        User userExistente = buscarPorId(id);
        
        userExistente.setNome(userAtualizado.getNome());
        userExistente.setEmail(userAtualizado.getEmail());
        
        if (userAtualizado.getStreak() != null) userExistente.setStreak(userAtualizado.getStreak());
        if (userAtualizado.getTotalPontos() != null) userExistente.setTotalPontos(userAtualizado.getTotalPontos());
        if (userAtualizado.getTotalResiduosKg() != null) userExistente.setTotalResiduosKg(userAtualizado.getTotalResiduosKg());
        
        User salvo = repository.save(userExistente);
        return new UserResponseDTO(salvo);
    }

    public void deletar(Long id) {
        User user = buscarPorId(id);
        repository.delete(user);
    }

    public void incrementarStreak(Long userId) {
        User user = buscarPorId(userId);
        java.time.LocalDate hoje = java.time.LocalDate.now();
        
        if (user.getUltimaAtividade() == null || user.getUltimaAtividade().plusDays(1).equals(hoje)) {
            user.setStreak(user.getStreak() + 1);
        } else if (user.getUltimaAtividade().isBefore(hoje.minusDays(1))) {
            user.setStreak(1);
        }
        
        user.setUltimaAtividade(hoje);
        repository.save(user);
    }

    public List<UserResponseDTO> listarTop3Ranking() {
        return repository.findTop3ByOrderByStreakDesc().stream().map(UserResponseDTO::new).toList();
    }
}
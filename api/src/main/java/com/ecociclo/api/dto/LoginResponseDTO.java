package com.ecociclo.api.dto;
public record LoginResponseDTO(UserResponseDTO user, String token) {}
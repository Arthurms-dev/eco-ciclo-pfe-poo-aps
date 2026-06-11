package com.ecociclo.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_scheduling")
public class Scheduling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHora;
    private String enderecoColeta;
    private Integer quantidade;
    @Column(name = "ponto_coleta_id")
    private Long pontoColetaId;

    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum;

    @ManyToOne
    @JoinColumn(name = "fk_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "fk_waste")
    private WasteItem wasteItem;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    
    public String getEnderecoColeta() { return enderecoColeta; }
    public void setEnderecoColeta(String enderecoColeta) { this.enderecoColeta = enderecoColeta; }
    
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    
    public Long getPontoColetaId() { return pontoColetaId; }
    public void setPontoColetaId(Long pontoColetaId) { this.pontoColetaId = pontoColetaId; }

    public StatusEnum getStatusEnum() { return statusEnum; }
    public void setStatusEnum(StatusEnum statusEnum) { this.statusEnum = statusEnum; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public WasteItem getWasteItem() { return wasteItem; }
    public void setWasteItem(WasteItem wasteItem) { this.wasteItem = wasteItem; }
}
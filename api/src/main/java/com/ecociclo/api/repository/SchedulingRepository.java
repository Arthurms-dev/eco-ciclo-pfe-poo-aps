package com.ecociclo.api.repository;

import com.ecociclo.api.model.Scheduling;
import com.ecociclo.api.model.StatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchedulingRepository extends JpaRepository<Scheduling, Long> {
    
    List<Scheduling> findByStatusEnum(StatusEnum statusEnum);
}
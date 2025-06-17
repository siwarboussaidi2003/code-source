package com.example.demo.repositories;

import com.example.demo.entities.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByUserIdOrderByDateInterventionDesc(Long userId);
    List<Intervention> findAllByOrderByDateInterventionDesc();
}
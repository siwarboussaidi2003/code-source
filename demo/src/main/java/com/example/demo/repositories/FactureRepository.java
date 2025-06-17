package com.example.demo.repositories;

import com.example.demo.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findAllByOrderByDateDesc();

    List<Facture> findByUserIdAndStatutOrderByDateDesc(Long userId, String statut);

    List<Facture> findByUserId(Long userId);

    List<Facture> findByStatut(String statut);

    List<Facture> findByType(String type);

    boolean existsByReference(String reference);
}
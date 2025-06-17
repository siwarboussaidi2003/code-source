package com.example.demo.repositories;

import com.example.demo.entities.Facture;
import com.example.demo.entities.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    List<Facture> findByFactureId(Long factureId);

    List<Facture> findByFactureIdOrderByDatePaiementDesc(Long factureId);

    boolean existsByFactureId(Long factureId);
}
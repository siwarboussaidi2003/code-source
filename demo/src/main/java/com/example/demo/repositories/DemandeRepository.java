package com.example.demo.repositories;

import com.example.demo.entities.Demande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {
    List<Demande> findAllByOrderByDateCreationDesc();
    long countByEtatFinaleIsNull(); // Count demandes where etatFinale is null (pending)


    Optional<Demande> findByReference(String reference);
    List<Demande> findByUserId(Long userId);
    List<Demande> findByEtatFinale(String etatFinale);
    List<Demande> findByTypeContrat(String typeContrat);
    List<Demande> findByTypeDemande(String typeDemande);
   // List<Demande> findByUserIdAndEtatFinale(Long userId, String etatFinale);
    boolean existsByReference(String reference);
}
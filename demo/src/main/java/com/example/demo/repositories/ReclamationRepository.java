package com.example.demo.repositories;

import com.example.demo.entities.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findAllByOrderByDateCreationDesc();
    long countByEtatFinaleIsNull(); // Count demandes where etatFinale is null (pending)


    Optional<Reclamation> findByReference(String reference);

    List<Reclamation> findByUserId(Long userId);

    List<Reclamation> findByEtatFinale(String etatFinale);

    List<Reclamation> findByTypeContrat(String typeContrat);

    List<Reclamation> findByTypeReclamation(String typeReclamation);

    List<Reclamation> findByUserIdAndEtatFinale(Long userId, String etatFinale);

    boolean existsByReference(String reference);
}
package com.example.demo.services;

import com.example.demo.entities.Reclamation;
import com.example.demo.repositories.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.logging.Level;

@Service
public class ReclamationService {
    private static final Logger logger = Logger.getLogger(ReclamationService.class.getName());
    private final Path uploadPath = Paths.get("uploads");

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Autowired
    private InterventionService interventionService;

    public ReclamationService() {
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Failed to create upload directory", e);
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public List<Reclamation> findAll() {
        try {
            logger.info("Fetching all reclamations");
            return reclamationRepository.findAllByOrderByDateCreationDesc();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching all reclamations", e);
            throw e;
        }
    }

    public Optional<Reclamation> findById(Long id) {
        try {
            logger.info("Finding reclamation by id: " + id);
            return reclamationRepository.findById(id);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error finding reclamation by id: " + id, e);
            throw e;
        }
    }

    public Reclamation save(Reclamation reclamation, MultipartFile photo) throws IOException {
        try {
            logger.info("Saving new reclamation");

            if (reclamation.getDateCreation() == null) {
                reclamation.setDateCreation(LocalDateTime.now());
            }

            if (reclamation.getEtatFinale() == null) {
                reclamation.setEtatFinale("Attente");
            }

            if (photo != null && !photo.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + photo.getOriginalFilename();
                Files.copy(photo.getInputStream(), uploadPath.resolve(fileName));
                reclamation.setPhotoPath(fileName);
            }

            Reclamation savedReclamation = reclamationRepository.save(reclamation);

            String description = String.format("Nouvelle réclamation %s: %s",
                    savedReclamation.getTypeContrat(),
                    savedReclamation.getTypeReclamation());

            interventionService.createIntervention(
                    savedReclamation.getReference(),
                    "RECLAMATION",
                    description,
                    savedReclamation.getUserId()
            );

            return savedReclamation;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error saving reclamation", e);
            throw e;
        }
    }

    public Optional<Reclamation> updateStatus(Long id, String status) {
        try {
            logger.info("Updating reclamation status: " + id);
            return reclamationRepository.findById(id)
                    .map(reclamation -> {
                        reclamation.setEtatFinale(status);
                        Reclamation updatedReclamation = reclamationRepository.save(reclamation);

                        String description = String.format("Mise à jour statut réclamation %s: %s",
                                updatedReclamation.getTypeReclamation(),
                                status);

                        interventionService.createIntervention(
                                updatedReclamation.getReference(),
                                "RECLAMATION",
                                description,
                                updatedReclamation.getUserId()
                        );

                        return updatedReclamation;
                    });
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error updating reclamation status", e);
            throw e;
        }
    }
}
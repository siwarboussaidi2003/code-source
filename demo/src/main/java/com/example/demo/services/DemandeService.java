package com.example.demo.services;

import com.example.demo.entities.Demande;
import com.example.demo.repositories.DemandeRepository;
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
public class DemandeService {
    private static final Logger logger = Logger.getLogger(DemandeService.class.getName());
    private final Path uploadPath = Paths.get("uploads");

    @Autowired
    private DemandeRepository demandeRepository;

    @Autowired
    private InterventionService interventionService;

    public DemandeService() {
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Failed to create upload directory", e);
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public List<Demande> findAll() {
        try {
            return demandeRepository.findAllByOrderByDateCreationDesc();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching all requests", e);
            throw e;
        }
    }

    public Optional<Demande> findById(Long id) {
        try {
            return demandeRepository.findById(id);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching request by id: " + id, e);
            throw e;
        }
    }

    public Demande save(Demande demande, MultipartFile photo) throws IOException {
        try {
            // Set creation date if not set
            if (demande.getDateCreation() == null) {
                demande.setDateCreation(LocalDateTime.now());
            }

            // Set initial status if not set
            if (demande.getEtatFinale() == null) {
                demande.setEtatFinale("Attente");
            }

            // Handle photo upload
            if (photo != null && !photo.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + photo.getOriginalFilename();
                Files.copy(photo.getInputStream(), uploadPath.resolve(fileName));
                demande.setPhotoPath(fileName);
            }

            Demande savedDemande = demandeRepository.save(demande);

            // Create intervention record
            String description = String.format("Nouvelle demande %s: %s",
                    savedDemande.getTypeContrat(),
                    savedDemande.getTypeDemande());

            interventionService.createIntervention(
                    savedDemande.getReference(),
                    "DEMANDE",
                    description,
                    savedDemande.getUserId()
            );

            return savedDemande;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error saving request", e);
            throw e;
        }
    }

    public Optional<Demande> updateStatus(Long id, String status) {
        try {
            return demandeRepository.findById(id)
                    .map(demande -> {
                        demande.setEtatFinale(status);
                        Demande updatedDemande = demandeRepository.save(demande);

                        // Create intervention for status update
                        String description = String.format("Mise à jour statut demande %s: %s",
                                updatedDemande.getTypeContrat(),
                                status);

                        interventionService.createIntervention(
                                updatedDemande.getReference(),
                                "DEMANDE",
                                description,
                                updatedDemande.getUserId()
                        );

                        return updatedDemande;
                    });
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error updating request status", e);
            throw e;
        }
    }
}
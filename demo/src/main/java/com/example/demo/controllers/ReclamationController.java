package com.example.demo.controllers;

import com.example.demo.entities.Reclamation;
import com.example.demo.repositories.ReclamationRepository;
import com.example.demo.services.ReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.logging.Logger;
import java.util.logging.Level;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReclamationController {
    private static final Logger logger = Logger.getLogger(ReclamationController.class.getName());

    @Autowired
    private ReclamationService reclamationService;

    @Autowired
    private ReclamationRepository reclamationRepository;

    @GetMapping
    public ResponseEntity<?> getAllReclamations() {
        try {
            logger.info("Fetching all reclamations");
            List<Reclamation> reclamations = reclamationService.findAll();
            return ResponseEntity.ok(reclamations);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching reclamations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching reclamations: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReclamationById(@PathVariable Long id) {
        try {
            logger.info("Fetching reclamation by id: " + id);
            return reclamationService.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching reclamation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching reclamation: " + e.getMessage());
        }
    }


    @PostMapping
    public ResponseEntity<?> createReclamation(
            @RequestParam("reference") String reference,
            @RequestParam("typeContrat") String typeContrat,
            @RequestParam(value = "typeReclamation", required = false) String typeReclamation,
            @RequestParam(value = "commentaire", required = false) String commentaire,
            @RequestParam(value = "etatFinale", required = false) String etatFinale,
            @RequestParam("userId") Long userId,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            logger.info("Creating new reclamation with individual parts");

            Reclamation reclamation = new Reclamation();
            reclamation.setReference(reference);
            reclamation.setTypeContrat(typeContrat);
            reclamation.setTypeReclamation(typeReclamation);
            reclamation.setCommentaire(commentaire);
            reclamation.setEtatFinale(etatFinale != null ? etatFinale : "Attente");
            reclamation.setUserId(userId);

            Reclamation savedReclamation = reclamationService.save(reclamation, photo);

            return ResponseEntity.ok(savedReclamation);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error creating reclamation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating reclamation: " + e.getMessage());
        }
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReclamationStatus(
            @PathVariable Long id,
            @RequestBody String status) {
        try {
            logger.info("Updating status for reclamation: " + id);
            return reclamationService.updateStatus(id, status)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error updating reclamation status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating reclamation status: " + e.getMessage());
        }
    }



    // Accepter ou refuser
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/accepter")
    public Reclamation accepterReclamation(@PathVariable Long id) {
        Reclamation reclamation = reclamationRepository.findById(id).orElse(null);
        if (reclamation != null && reclamation.getEtatFinale() == null) {
            reclamation.setEtatFinale("acceptée");
            reclamationRepository.save(reclamation);
        }
        return reclamation;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/refuser")
    public Reclamation refuserReclamation(@PathVariable Long id) {
        Reclamation reclamation = reclamationRepository.findById(id).orElse(null);
        if (reclamation != null && reclamation.getEtatFinale() == null) {
            reclamation.setEtatFinale("refusée");
            reclamationRepository.save(reclamation);
        }
        return reclamation;
    }

}
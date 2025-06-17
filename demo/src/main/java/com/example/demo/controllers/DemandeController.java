package com.example.demo.controllers;

import com.example.demo.entities.Demande;
import com.example.demo.repositories.DemandeRepository;
import com.example.demo.services.DemandeService;
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
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "http://localhost:5173")
public class DemandeController {
    private static final Logger logger = Logger.getLogger(DemandeController.class.getName());

    @Autowired
    private DemandeService demandeService;

    @Autowired
    private DemandeRepository demandeRepository;

    @GetMapping
    public ResponseEntity<?> getAllDemandes() {
        try {
            logger.info("Fetching all demandes");
            List<Demande> demandes = demandeService.findAll();
            return ResponseEntity.ok(demandes);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching demandes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching demandes: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDemandeById(@PathVariable Long id) {
        try {
            logger.info("Fetching demande with id: " + id);
            return demandeService.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching demande", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching demande: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createDemande(
            @RequestPart("demande") Demande demande,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        try {
            logger.info("Creating new demande");
            Demande savedDemande = demandeService.save(demande, photo);
            return ResponseEntity.ok(savedDemande);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error creating demande", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating demande: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDemandeStatus(
            @PathVariable Long id,
            @RequestBody String status) {
        try {
            logger.info("Updating status for demande: " + id);
            return demandeService.updateStatus(id, status)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error updating demande status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating demande status: " + e.getMessage());
        }
    }



    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/accepter")
    public Demande accepterDemande(@PathVariable Long id) {
        Demande demande = demandeRepository.findById(id).orElse(null);
        if (demande != null && demande.getEtatFinale() == null) {
            demande.setEtatFinale("acceptée");
            demandeRepository.save(demande);
        }
        return demande;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/refuser")
    public Demande refuserDemande(@PathVariable Long id) {
        Demande demande = demandeRepository.findById(id).orElse(null);
        if (demande != null && demande.getEtatFinale() == null) {
            demande.setEtatFinale("refusée");
            demandeRepository.save(demande);
        }
        return demande;
    }



}
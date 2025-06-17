package com.example.demo.controllers;

import com.example.demo.entities.Facture;
import com.example.demo.dto.PaymentRequest;
import com.example.demo.services.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.logging.Logger;
import java.util.logging.Level;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "http://localhost:5173")
public class FactureController {
    private static final Logger logger = Logger.getLogger(FactureController.class.getName());

    @Autowired
    private FactureService factureService;

    @GetMapping
    public ResponseEntity<?> getAllFactures() {
        try {
            List<Facture> factures = factureService.getAllFactures();
            return ResponseEntity.ok(factures);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching all invoices", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching invoices: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFactureById(@PathVariable Long id) {
        try {
            Facture facture = factureService.getFactureById(id);
            return ResponseEntity.ok(facture);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching invoice", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Invoice not found: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/payees")
    public ResponseEntity<?> getFacturesPayees(@PathVariable Long userId) {
        try {
            List<Facture> factures = factureService.getFacturesPayeesByUser(userId);
            return ResponseEntity.ok(factures);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching paid invoices", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching paid invoices: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/en-attente")
    public ResponseEntity<?> getFacturesEnAttente(@PathVariable Long userId) {
        try {
            List<Facture> factures = factureService.getFacturesEnAttenteByUser(userId);
            return ResponseEntity.ok(factures);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching pending invoices", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching pending invoices: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/payer")
    public ResponseEntity<?> payerFacture(
            @PathVariable Long id,
            @RequestBody PaymentRequest paymentRequest) {
        try {
            Facture facture = factureService.payerFacture(id, paymentRequest);
            return ResponseEntity.ok(facture);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error processing payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Payment processing error: " + e.getMessage());
        }
    }
}
package com.example.demo.services;

import com.example.demo.entities.Facture;
import com.example.demo.entities.Paiement;
import com.example.demo.dto.PaymentRequest;
import com.example.demo.repositories.FactureRepository;
import com.example.demo.repositories.PaiementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.logging.Level;

@Service
public class FactureService {
    private static final Logger logger = Logger.getLogger(FactureService.class.getName());

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private InterventionService interventionService;

    public List<Facture> getFacturesPayeesByUser(Long userId) {
        try {
            logger.info("Fetching paid invoices for user: " + userId);
            return factureRepository.findByUserIdAndStatutOrderByDateDesc(userId, "Payé");
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching paid invoices", e);
            throw e;
        }
    }

    public List<Facture> getFacturesEnAttenteByUser(Long userId) {
        try {
            logger.info("Fetching pending invoices for user: " + userId);
            return factureRepository.findByUserIdAndStatutOrderByDateDesc(userId, "En attente");
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching pending invoices", e);
            throw e;
        }
    }

    @Transactional
    public Facture payerFacture(Long factureId, PaymentRequest request) {
        try {
            logger.info("Processing payment for invoice: " + factureId);

            Facture facture = factureRepository.findById(factureId)
                    .orElseThrow(() -> new RuntimeException("Facture non trouvée"));

            if ("Payé".equals(facture.getStatut())) {
                logger.warning("Attempt to pay already paid invoice: " + factureId);
                throw new RuntimeException("Cette facture est déjà payée");
            }

            // Create payment record
            Paiement paiement = new Paiement();
            paiement.setFactureId(factureId);
            paiement.setNomCarte(request.getNomCarte());
            paiement.setNumeroCarte(request.getNumeroCarte().replaceAll("\\s", ""));
            paiement.setDateExpiration(request.getDateExpiration());
            paiement.setCodeSecurite(request.getCodeSecurite());
            paiement.setDatePaiement(LocalDateTime.now());
            paiement.setMontant(facture.getMontant());

            paiementRepository.save(paiement);

            // Update invoice status
            facture.setStatut("Payé");
            facture.setDatePaiement(LocalDateTime.now());

            // Create intervention record
            String description = String.format("Paiement effectué avec succès - Montant: %s %s",
                    facture.getMontant(),
                    facture.getType());

            interventionService.createIntervention(
                    facture.getReference(),
                    "PAIEMENT",
                    description,
                    facture.getUserId()
            );

            return factureRepository.save(facture);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error processing payment", e);
            throw e;
        }
    }

    public Facture getFactureById(Long id) {
        try {
            logger.info("Fetching invoice by id: " + id);
            return factureRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching invoice", e);
            throw e;
        }
    }

    public List<Facture> getAllFactures() {
        try {
            return factureRepository.findAllByOrderByDateDesc();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching all invoices", e);
            throw e;
        }
    }
}
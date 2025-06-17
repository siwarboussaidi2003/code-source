package com.example.demo.services;

import com.example.demo.entities.Intervention;
import com.example.demo.repositories.InterventionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.logging.Level;

@Service
public class InterventionService {
    private static final Logger logger = Logger.getLogger(InterventionService.class.getName());

    @Autowired
    private InterventionRepository interventionRepository;

    public Intervention createIntervention(String reference, String typeIntervention,
                                           String description, Long userId) {
        try {
            logger.info("Creating intervention for user: " + userId);

            Intervention intervention = new Intervention();
            intervention.setReference(reference);
            intervention.setTypeIntervention(typeIntervention);
            intervention.setDescription(description);
            intervention.setDateIntervention(LocalDateTime.now());
            intervention.setEtat("En attente");
            intervention.setUserId(userId);

            return interventionRepository.save(intervention);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error creating intervention", e);
            throw e;
        }
    }

    public List<Intervention> getInterventionsByUser(Long userId) {
        try {
            return interventionRepository.findByUserIdOrderByDateInterventionDesc(userId);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching user interventions", e);
            throw e;
        }
    }

    public List<Intervention> getAllInterventions() {
        try {
            return interventionRepository.findAllByOrderByDateInterventionDesc();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error fetching all interventions", e);
            throw e;
        }
    }
}
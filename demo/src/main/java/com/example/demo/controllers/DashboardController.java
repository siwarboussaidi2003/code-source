package com.example.demo.controllers;

import com.example.demo.repositories.DemandeRepository;
import com.example.demo.repositories.ReclamationRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173") // Autorise les requêtes depuis React
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DemandeRepository demandeRepository;

    @Autowired
    private ReclamationRepository reclamationRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Map<String, Object> getDashboardData() {
        Map<String, Object> response = new HashMap<>();

        try {
            long userCount = userRepository.count();
            long demandeCount = demandeRepository.countByEtatFinaleIsNull();      // demandes en attente
            long reclamationCount = reclamationRepository.countByEtatFinaleIsNull(); // réclamations en attente

            response.put("userCount", userCount);
            response.put("demandeCount", demandeCount);
            response.put("reclamationCount", reclamationCount);


        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Erreur lors du chargement des données du dashboard.");
        }

        return response;
    }
}

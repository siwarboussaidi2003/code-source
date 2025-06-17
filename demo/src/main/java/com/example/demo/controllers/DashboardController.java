package com.example.demo.controllers;

import com.example.demo.repositories.DemandeRepository;
import com.example.demo.repositories.ReclamationRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/dashboard")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from your React app
public class DashboardController {

    @Autowired
    private UserRepository userRepository; // Assuming you have a UserRepository
    @Autowired
    private DemandeRepository demandeRepository; // Assuming you have a DemandeRepository
    @Autowired
    private ReclamationRepository reclamationRepository; // Assuming you have a ReclamationRepository

    @GetMapping // Corrected: Remove "/dashboard"
    public Map<String, Long> getDashboardData() {
        long userCount = userRepository.count();
        long demandeCount = demandeRepository.countByEtatFinaleIsNull(); // Count pending demandes
        long reclamationCount = reclamationRepository.countByEtatFinaleIsNull(); // Count pending reclamations

        Map<String, Long> data = new HashMap<>();
        data.put("userCount", userCount);
        data.put("demandeCount", demandeCount);
        data.put("reclamationCount", reclamationCount);

        return data;
    }
}
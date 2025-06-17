package com.example.demo.controllers;

import com.example.demo.entities.Intervention;
import com.example.demo.services.InterventionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interventions")
@CrossOrigin(origins = "http://localhost:5173")
public class InterventionController {
    @Autowired
    private InterventionService interventionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Intervention>> getUserInterventions(@PathVariable Long userId) {
        List<Intervention> interventions = interventionService.getInterventionsByUser(userId);
        return ResponseEntity.ok(interventions);
    }

    @GetMapping
    public ResponseEntity<List<Intervention>> getAllInterventions() {
        List<Intervention> interventions = interventionService.getAllInterventions();
        return ResponseEntity.ok(interventions);
    }
}
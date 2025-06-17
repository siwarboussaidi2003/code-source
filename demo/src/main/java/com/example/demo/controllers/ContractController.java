package com.example.demo.controllers;

import com.example.demo.entities.Contract;
import com.example.demo.repositories.ContractRepository;
import com.example.demo.services.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@PreAuthorize("hasRole('CLIENT')")
@RequestMapping("/api/contracts")
@CrossOrigin(origins = "http://localhost:5173")
public class ContractController {

    private static final Logger logger = LoggerFactory.getLogger(ContractController.class);

    @Autowired
    private ContractService contractService;

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping
    public ResponseEntity<List<Contract>> getAllContracts() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            logger.info("User: {}", auth.getName());
            logger.info("Authorities: {}", auth.getAuthorities());

            logger.info("Fetching all contracts");
            List<Contract> contracts = contractService.getAllContracts();
            return ResponseEntity.ok(contracts);
        } catch (Exception e) {
            logger.error("Error fetching contracts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping
    public ResponseEntity<?> createContract(@RequestBody Contract contract) {
        try {
            logger.info("Creating contract: {}", contract);
            Contract savedContract = contractService.saveContract(contract);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedContract);
        } catch (Exception e) {
            logger.error("Error creating contract", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating contract: " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/{id}")
    public ResponseEntity<Contract> getContractById(@PathVariable Long id) {
        return contractService.getContractById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


}

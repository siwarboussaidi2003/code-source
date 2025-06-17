package com.example.demo.services;

import com.example.demo.entities.Contract;
import com.example.demo.repositories.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@PreAuthorize("hasRole('CLIENT')")
public class ContractService {
    @Autowired
    private ContractRepository contractRepository;

    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    public Contract saveContract(Contract contract) {
        if (contract.getDateCreation() == null) {
            contract.setDateCreation(LocalDateTime.now());
        }
        return contractRepository.save(contract);
    }


    public Optional<Contract> getContractById(Long id) {
        return contractRepository.findById(id);
    }
}
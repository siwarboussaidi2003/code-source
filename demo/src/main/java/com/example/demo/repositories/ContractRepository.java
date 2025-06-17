package com.example.demo.repositories;

import com.example.demo.entities.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

@PreAuthorize("hasRole('CLIENT')")
@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {}
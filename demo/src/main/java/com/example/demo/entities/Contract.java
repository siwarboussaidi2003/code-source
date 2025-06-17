package com.example.demo.entities;

import jakarta.persistence.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
@PreAuthorize("hasRole('CLIENT')")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reference;
    private String localisation;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReference() { return reference; }
        public void setReference(String reference) { this.reference = reference; }
    public String getLocalisation() { return localisation; }
    public void setLocalisation(String localisation) { this.localisation = localisation; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
}
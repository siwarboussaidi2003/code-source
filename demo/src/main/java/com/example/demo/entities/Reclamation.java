package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@Table(name = "reclamations")
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50, unique = true)
    private String reference;

    @Column(name = "type_contrat", nullable = false, length = 20)
    private String typeContrat;

    @Column(name = "type_reclamation", length = 100)
    private String typeReclamation;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(name = "photo_path")
    private String photoPath;

    @Column(name = "etatFinale", length = 20)
    private String etatFinale = "En attente";

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Constructor Required by JPA
    public Reclamation() {}


    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        if (etatFinale == null) {
            etatFinale = "En attente";
        }
    }
}
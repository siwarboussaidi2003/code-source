package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "demandes")
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String reference;

    @Column(name = "type_contrat", nullable = false, length = 20)
    private String typeContrat;

    @Column(name = "type_demande", length = 100)
    private String typeDemande;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(name = "etatFinale", length = 20)
    private String etatFinale = "Attente";

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "user_id")
    private Long userId;
}
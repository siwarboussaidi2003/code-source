package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "interventions")
@Data
public class Intervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reference;

    @Column(name = "type_intervention", nullable = false)
    private String typeIntervention;

    @Column(nullable = false)
    private String description;

    @Column(name = "date_intervention", nullable = false)
    private LocalDateTime dateIntervention;

    @Column(nullable = false)
    private String etat;

    @Column(name = "user_id")
    private Long userId;
}
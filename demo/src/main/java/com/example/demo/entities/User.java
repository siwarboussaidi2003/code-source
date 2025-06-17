package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200)
    private String nom;

    @Column(length = 200)
    private String prenom;

    @Column(length = 8)
    private String cin;

    @Column(length = 8)
    private String telephone;

    @Column(length = 200)
    private String email;

    @Column(length = 200)
    private String motDePasse;

    private boolean enabled = false;

    @Column(length = 100, unique = true)
    private String activationToken;

    @Enumerated(EnumType.STRING)
    private Role role;
}

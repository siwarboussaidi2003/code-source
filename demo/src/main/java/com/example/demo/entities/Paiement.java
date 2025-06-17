package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "paiements")
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facture_id", nullable = false)
    private Long factureId;

    @Column(name = "nom_carte", nullable = false)
    private String nomCarte;

    @Column(name = "numero_carte", nullable = false)
    private String numeroCarte;

    @Column(name = "date_expiration", nullable = false)
    private String dateExpiration;

    @Column(name = "code_securite", nullable = false)
    private String codeSecurite;

    @Column(name = "date_paiement", nullable = false)
    private LocalDateTime datePaiement;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;
}
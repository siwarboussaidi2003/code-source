package com.example.demo.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private String nomCarte;
    private String numeroCarte;
    private String dateExpiration;
    private String codeSecurite;
}
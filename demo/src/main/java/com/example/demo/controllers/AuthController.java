package com.example.demo.controllers;

import com.example.demo.Security.JwtUtil;
import com.example.demo.dto.LoginRequest;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid User user) {
        // ATTENTION : le mot de passe n’est pas encodé ici !
        userService.register(user);
        return ResponseEntity.ok("Inscription réussie. Vérifiez votre email pour activer votre compte.");
    }

    @GetMapping("/activate")
    public ResponseEntity<?> activate(@RequestParam String token) {
        boolean activated = userService.activateAccount(token);
        if (activated) {
            return ResponseEntity.status(302)
                    .location(URI.create("http://localhost:5173/seconnecter"))
                    .build();
        } else {
            return ResponseEntity.badRequest().body("Lien invalide ou expiré.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Email invalide ou compte non activé.");
        }

        User user = optionalUser.get();

        if (!user.isEnabled()) {
            return ResponseEntity.badRequest().body("Email invalide ou compte non activé.");
        }

        // Comparaison directe du mot de passe (pas sécurisé)
        if (!request.getPassword().equals(user.getMotDePasse())) {
            return ResponseEntity.badRequest().body("Mot de passe incorrect.");
        }

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority( user.getRole().name());


        String token = jwtUtil.generateToken(
                user.getEmail(),
                List.of(authority) // transforme en Collection<? extends GrantedAuthority>
        );
        return ResponseEntity.ok(Map.of("token", token));
    }
}
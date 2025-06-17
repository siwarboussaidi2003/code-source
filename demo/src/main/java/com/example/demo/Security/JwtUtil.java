package com.example.demo.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

    // Générer un token JWT pour un email avec les rôles, en conservant "ROLE_" dans le token
    public String generateToken(String email, Collection<? extends GrantedAuthority> roles) {
        return Jwts.builder()
                .setSubject(email)
                .claim("roles", roles.stream()
                        .map(GrantedAuthority::getAuthority)  // on garde ROLE_ tel quel
                        .collect(Collectors.toList()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Extraire l’email à partir du token
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // Extraire les rôles depuis le token
    @SuppressWarnings("unchecked")
    public Collection<String> extractRoles(String token) {
        return (Collection<String>) getClaims(token).get("roles");
    }

    // Vérifier si le token est encore valide
    public boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

    // Vérifier si le token est expiré
    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // Extraire les claims du token
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}

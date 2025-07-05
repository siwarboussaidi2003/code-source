package com.example.demo.Security;

import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Ignorer les URLs publiques (authentification, inscription, activation, etc.)
        if (path.startsWith("/api/auth/")) {
            chain.doFilter(request, response);
            return;  // ne pas faire plus de traitement dans ce filtre
        }

        final String authHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;

        logger.debug("debut authHeader "+authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(jwt);
                List<String> roles = new ArrayList<>(jwtUtil.extractRoles(jwt));
                List<GrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null && jwtUtil.validateToken(jwt, user.getEmail())) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    logger.warn("invalid authHeader ");
                }
            } catch (ExpiredJwtException e) {
               // System.out.println("Token expiré");
            } catch (Exception e) {
               // System.out.println("Erreur de parsing du token");
            }
        }

        chain.doFilter(request, response);
    }


}

package com.example.demo.services;

import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void register(User user) {
        if (user.getRole() == null) {
            user.setRole(Role.CLIENT);
        }

        user.setEnabled(false);
        user.setActivationToken(UUID.randomUUID().toString());

        userRepository.save(user);
        sendActivationEmail(user);
    }

    private void sendActivationEmail(User user) {
        String link = "http://localhost:8080/api/auth/activate?token=" + user.getActivationToken();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Activation de votre compte AquaWatt");
        message.setText("Cliquez sur ce lien pour activer votre compte : " + link);
        mailSender.send(message);
    }

    public boolean activateAccount(String token) {
        Optional<User> optionalUser = userRepository.findByActivationToken(token);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEnabled(true);
            user.setActivationToken(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}

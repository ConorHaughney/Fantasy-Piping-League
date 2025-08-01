package com.example.FantasyPipingLeague.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.FantasyPipingLeague.dto.LoginUserDto;
import com.example.FantasyPipingLeague.dto.RegisterUserDto;
import com.example.FantasyPipingLeague.dto.VerifyUserDto;
import com.example.FantasyPipingLeague.model.User;
import com.example.FantasyPipingLeague.repository.UserRepository;

import jakarta.mail.MessagingException;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public User signUp(RegisterUserDto input) {
        User user = new User(input.getFirstName(), input.getLastName(), input.getUsername(), input.getEmail(),
                passwordEncoder.encode(input.getPassword()));
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);
        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto loginUserDto) {
        User user = userRepository.findByUsername(loginUserDto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found with username: " + loginUserDto.getUsername()));
        if (!user.isEnabled()) {
            throw new RuntimeException("This account is not verified.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginUserDto.getPassword()));
        return user;
    }

    public void verifyUser(VerifyUserDto verifyUserDto) {
        Optional<User> optionalUser = userRepository.findByEmail(verifyUserDto.getEmail());
        if (optionalUser.isPresent()) {
            User foundUser = optionalUser.get();
            if (foundUser.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code has expired.");
            }
            if (foundUser.getVerificationCode().equals(verifyUserDto.getVerificationCode()) &&
                    foundUser.getVerificationCodeExpiresAt().isAfter(LocalDateTime.now())) {
                foundUser.setEnabled(true);
                foundUser.setVerificationCode(null);
                foundUser.setVerificationCodeExpiresAt(null);
                userRepository.save(foundUser);
            } else {
                throw new RuntimeException("Invalid or expired verification code.");
            }
        } else {
            throw new RuntimeException("User not found with email: " + verifyUserDto.getEmail());
        }
    }

    public void resendVerificationEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User foundUser = user.get();
            if (foundUser.isEnabled()) {
                throw new RuntimeException("This account is already verified.");
            }
            foundUser.setVerificationCode(generateVerificationCode());
            foundUser.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
            userRepository.save(foundUser);
            sendVerificationEmail(foundUser);
        } else {
            throw new RuntimeException("User not found with email: " + email);
        }
    }

    private String generateVerificationCode() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }

    private void sendVerificationEmail(User user) {
        String subject = "Fantasy Piping League - Verify your account";
        String verificationCode = user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }
}

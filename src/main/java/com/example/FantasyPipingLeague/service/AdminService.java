package com.example.FantasyPipingLeague.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.FantasyPipingLeague.admin.model.Admin;
import com.example.FantasyPipingLeague.admin.model.AdminSession;
import com.example.FantasyPipingLeague.admin.repository.AdminRepository;
import com.example.FantasyPipingLeague.admin.repository.AdminSessionRepository;
import com.example.FantasyPipingLeague.dto.AdminStatsDto;
import com.example.FantasyPipingLeague.repository.BandRepository;
import com.example.FantasyPipingLeague.repository.FantasyTeamRepository;
import com.example.FantasyPipingLeague.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminSessionRepository adminSessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FantasyTeamRepository fantasyTeamRepository;

    @Autowired
    private BandRepository bandRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String createAdminSession(Admin admin, String ipAddress, String userAgent) {
        String sessionToken = UUID.randomUUID().toString();
        AdminSession session = new AdminSession(admin, sessionToken, ipAddress, userAgent);
        adminSessionRepository.save(session);
        return sessionToken;
    }

    public Optional<Admin> validateSession(String sessionToken) {
        Optional<AdminSession> sessionOpt = adminSessionRepository.findBySessionTokenAndIsActiveTrue(sessionToken);
        if (sessionOpt.isPresent()) {
            AdminSession session = sessionOpt.get();
            if (session.getExpiresAt().isAfter(LocalDateTime.now())) {
                return Optional.of(session.getAdmin());
            } else {
                // Deactivate expired session
                session.setActive(false);
                adminSessionRepository.save(session);
            }
        }
        return Optional.empty();
    }

    public void invalidateSession(String sessionToken) {
        adminSessionRepository.findBySessionTokenAndIsActiveTrue(sessionToken)
                .ifPresent(session -> {
                    session.setActive(false);
                    adminSessionRepository.save(session);
                });
    }

    public AdminStatsDto getSystemStats() {
        long totalUsers = userRepository.count();
        long totalTeams = fantasyTeamRepository.count();
        long totalBands = bandRepository.count();
        long activeUsers = userRepository.countByEnabledTrue();

        return new AdminStatsDto(totalUsers, totalTeams, totalBands, activeUsers);
    }

    public void cleanupExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        adminSessionRepository.deactivateExpiredSessions(now);
        // Delete sessions that have been expired for more than 24 hours
        adminSessionRepository.deleteOldExpiredSessions(now.minusHours(24));
    }

    public Optional<Admin> authenticate(String username, String password) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                return Optional.of(admin);
            }
        }
        return Optional.empty();
    }

    // Debugging

    public Optional<Admin> authenticateAdmin(String username, String password) {
        System.out.println("=== ADMIN AUTHENTICATION DEBUG ===");
        System.out.println("Attempting to authenticate username: '" + username + "'");

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            System.out.println("✓ Admin found in database");
            System.out.println("  Database username: '" + admin.getUsername() + "'");
            System.out.println("  Database email: '" + admin.getEmail() + "'");
            System.out.println("  Is active: " + admin.isActive());
            System.out.println("  Password hash length: " + admin.getPassword().length());
            System.out.println("  Input password length: " + password.length());

            if (admin.isActive()) {
                boolean passwordMatches = passwordEncoder.matches(password, admin.getPassword());
                System.out.println("  Password matches: " + passwordMatches);

                if (passwordMatches) {
                    admin.setLastLogin(LocalDateTime.now());
                    adminRepository.save(admin);
                    System.out.println("✓ Authentication successful!");
                    return Optional.of(admin);
                } else {
                    System.out.println("✗ Password does not match");
                }
            } else {
                System.out.println("✗ Admin account is not active");
            }
        } else {
            System.out.println("✗ Admin not found in database for username: '" + username + "'");

            // Let's also check what admins exist
            System.out.println("Existing admins in database:");
            adminRepository.findAll().forEach(admin -> {
                System.out.println("  - Username: '" + admin.getUsername() + "', Email: '" + admin.getEmail()
                        + "', Active: " + admin.isActive());
            });
        }
        System.out.println("=================================");
        return Optional.empty();
    }
}
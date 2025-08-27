package com.example.FantasyPipingLeague.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FantasyPipingLeague.model.Band;
import com.example.FantasyPipingLeague.model.FantasyTeam;
import com.example.FantasyPipingLeague.model.User;
import com.example.FantasyPipingLeague.repository.BandRepository;
import com.example.FantasyPipingLeague.repository.FantasyTeamRepository;
import com.example.FantasyPipingLeague.repository.UserRepository;

@Service
public class FantasyTeamService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BandRepository bandRepository;

    @Autowired
    private FantasyTeamRepository fantasyTeamRepository;

    public FantasyTeam addBandToTeam(String username, Long bandId, String judgeType) {
        try {
            System.out.println("=== SERVICE: addBandToTeam ===");
            System.out.println("Looking for user: " + username);

            // Find the user
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        System.err.println("User not found: " + username);
                        return new RuntimeException("User not found: " + username);
                    });

            System.out.println("User found: " + user.getId());
            System.out.println("Looking for band with ID: " + bandId);

            // Find the band
            Band band = bandRepository.findById(bandId)
                    .orElseThrow(() -> {
                        System.err.println("Band not found: " + bandId);
                        return new RuntimeException("Band not found: " + bandId);
                    });

            System.out.println("Band found: " + band.getBands());
            System.out.println("Looking for existing fantasy team...");

            // Find or create fantasy team for user
            FantasyTeam fantasyTeam = fantasyTeamRepository.findByUser(user)
                    .orElseGet(() -> {
                        System.out.println("Creating new fantasy team for user: " + username);
                        FantasyTeam newTeam = new FantasyTeam();
                        newTeam.setUser(user);
                        newTeam.setTeamName(username + "'s Fantasy Team");
                        return fantasyTeamRepository.save(newTeam);
                    });

            System.out.println("Fantasy team: " + fantasyTeam.getId());
            System.out.println("Assigning band to judge type: " + judgeType);

            // Assign band to the appropriate judge type field
            switch (judgeType.toLowerCase()) {
                case "piping1", "piping_1" -> fantasyTeam.setPiping1Band(band);
                case "piping2", "piping_2" -> fantasyTeam.setPiping2Band(band);
                case "drumming" -> fantasyTeam.setDrummingBand(band);
                case "ensemble", "ensamble" -> fantasyTeam.setEnsembleBand(band);
                default -> throw new RuntimeException("Invalid judge type: " + judgeType);
            }

            FantasyTeam saved = fantasyTeamRepository.save(fantasyTeam);
            System.out.println("SUCCESS: Fantasy team updated with new band assignment");

            return saved;

        } catch (Exception e) {
            System.err.println("SERVICE ERROR: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public FantasyTeam save(FantasyTeam team) {
        try {
            return fantasyTeamRepository.save(team);
        } catch (Exception e) {
            System.err.println("SERVICE ERROR in save: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public FantasyTeam getFantasyTeamByUsername(String username) {
        try {
            System.out.println("=== SERVICE: getFantasyTeamByUsername ===");
            System.out.println("Looking for user: " + username);

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            Optional<FantasyTeam> fantasyTeam = fantasyTeamRepository.findByUser(user);

            if (fantasyTeam.isPresent()) {
                System.out.println("Fantasy team found for user: " + username);
                return fantasyTeam.get();
            } else {
                System.out.println("No fantasy team found for user: " + username);
                return null;
            }

        } catch (Exception e) {
            System.err.println("SERVICE ERROR in getFantasyTeamByUsername: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public FantasyTeam createFantasyTeam(String username, String teamName) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            // Check if user already has a fantasy team
            Optional<FantasyTeam> existingTeam = fantasyTeamRepository.findByUser(user);
            if (existingTeam.isPresent()) {
                throw new RuntimeException("User already has a fantasy team");
            }

            FantasyTeam fantasyTeam = new FantasyTeam();
            fantasyTeam.setUser(user);
            fantasyTeam.setTeamName(teamName);

            return fantasyTeamRepository.save(fantasyTeam);

        } catch (Exception e) {
            System.err.println("SERVICE ERROR in createFantasyTeam: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
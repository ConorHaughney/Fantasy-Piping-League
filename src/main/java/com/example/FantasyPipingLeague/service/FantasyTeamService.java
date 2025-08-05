package com.example.FantasyPipingLeague.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FantasyPipingLeague.repository.UserRepository;
import com.example.FantasyPipingLeague.repository.BandRepository;
import com.example.FantasyPipingLeague.repository.FantasyTeamRepository;
import com.example.FantasyPipingLeague.repository.FantasyTeamBandRepository;
import com.example.FantasyPipingLeague.model.User;
import com.example.FantasyPipingLeague.model.Band;
import com.example.FantasyPipingLeague.model.FantasyTeam;
import com.example.FantasyPipingLeague.model.FantasyTeamBand;

@Service
public class FantasyTeamService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BandRepository bandRepository;

    @Autowired
    private FantasyTeamRepository fantasyTeamRepository;

    @Autowired
    private FantasyTeamBandRepository fantasyTeamBandRepository;

    public FantasyTeamBand addBandToTeam(String username, Long bandId, String judgeType) {
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
            System.out.println("Checking for existing band-judge combination...");

            // Check if band is already added for this judge type
            Optional<FantasyTeamBand> existingEntry = fantasyTeamBandRepository
                    .findByFantasyTeamAndJudgeType(fantasyTeam, judgeType);

            FantasyTeamBand fantasyTeamBand;

            if (existingEntry.isPresent()) {
                // Update existing entry
                System.out.println("Updating existing entry for judge type: " + judgeType);
                fantasyTeamBand = existingEntry.get();
                fantasyTeamBand.setBand(band); // Update to new band
            } else {
                // Create new entry
                System.out.println("Creating new fantasy team band entry...");
                fantasyTeamBand = new FantasyTeamBand();
                fantasyTeamBand.setFantasyTeam(fantasyTeam);
                fantasyTeamBand.setBand(band);
                fantasyTeamBand.setJudgeType(judgeType);
            }

            FantasyTeamBand saved = fantasyTeamBandRepository.save(fantasyTeamBand);
            System.out.println("SUCCESS: Fantasy team band saved with ID: " + saved.getId());

            return saved;

        } catch (Exception e) {
            System.err.println("SERVICE ERROR: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
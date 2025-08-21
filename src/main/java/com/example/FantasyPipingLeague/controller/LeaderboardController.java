package com.example.FantasyPipingLeague.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.FantasyPipingLeague.responses.LeaderboardResponse;
import com.example.FantasyPipingLeague.service.LeaderboardService;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Leaderboard API is working");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getLeaderboard() {
        try {
            System.out.println("=== LEADERBOARD API CALLED ===");
            LeaderboardResponse leaderboard = leaderboardService.getCurrentLeaderboard();
            System.out.println("Leaderboard entries: " + leaderboard.getEntries().size());
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            System.err.println("Error fetching leaderboard: " + e.getMessage());
            e.printStackTrace();

            // Return error as JSON instead of letting it fail
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch leaderboard");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
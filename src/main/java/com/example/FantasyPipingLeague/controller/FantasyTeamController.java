package com.example.FantasyPipingLeague.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.FantasyPipingLeague.dto.AddBandDto;
import com.example.FantasyPipingLeague.service.FantasyTeamService;
import com.example.FantasyPipingLeague.model.Band;
import com.example.FantasyPipingLeague.model.FantasyTeamBand;
import com.example.FantasyPipingLeague.responses.AddBandResponse;
import com.example.FantasyPipingLeague.responses.ErrorResponse;

import com.example.FantasyPipingLeague.repository.BandRepository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.example.FantasyPipingLeague.model.Band;

@RestController
@RequestMapping("/api/fantasy-teams")
@CrossOrigin(origins = "http://localhost:3000")
public class FantasyTeamController {

    @Autowired
    private FantasyTeamService fantasyTeamService;

    @Autowired
    private BandRepository bandRepository;

    @PostMapping("/add-band")
    public ResponseEntity<?> addBandToTeam(@RequestBody AddBandDto request, Authentication auth) {
        try {
            // Add detailed logging
            System.out.println("=== ADD BAND REQUEST ===");
            System.out.println(
                    "Request received - Band ID: " + request.getBandId() + ", Judge Type: " + request.getJudgeType());
            System.out.println("Authentication: " + (auth != null ? auth.getName() : "null"));
            System.out.println("Auth details: " + (auth != null ? auth.getDetails() : "null"));

            if (auth == null) {
                System.err.println("ERROR: Authentication is null");
                return ResponseEntity.badRequest().body(new ErrorResponse("Authentication required"));
            }

            String username = auth.getName();
            System.out.println("Username extracted: " + username);

            System.out.println("Calling service to add band...");
            FantasyTeamBand result = fantasyTeamService.addBandToTeam(
                    username,
                    request.getBandId(),
                    request.getJudgeType());

            System.out.println("Service call successful, creating response...");
            AddBandResponse response = new AddBandResponse(
                    "Band added successfully",
                    result.getId(),
                    result.getBand().getBands(),
                    result.getJudgeType());

            System.out.println("SUCCESS: Returning response - " + response.getMessage());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("ERROR in addBandToTeam: " + e.getMessage());
            System.err.println("Exception type: " + e.getClass().getSimpleName());
            e.printStackTrace();

            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/test-bands")
    public ResponseEntity<?> testBands() {
        try {
            System.out.println("=== TESTING DATABASE CONNECTION ===");
            List<Band> bands = bandRepository.findAll();
            System.out.println("Found " + bands.size() + " bands in database:");

            bands.forEach(b -> System.out
                    .println("  ID: " + b.getId() + ", Name: " + b.getBands() + ", Grade: " + b.getGrade()));

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Database connection successful");
            response.put("bandCount", bands.size());
            response.put("bands", bands);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Database connection error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Database error: " + e.getMessage()));
        }
    }
}
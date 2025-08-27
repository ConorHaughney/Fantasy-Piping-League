package com.example.FantasyPipingLeague.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.FantasyPipingLeague.dto.AddBandDto;
import com.example.FantasyPipingLeague.model.Band;
import com.example.FantasyPipingLeague.model.FantasyTeam;
import com.example.FantasyPipingLeague.repository.BandRepository;
import com.example.FantasyPipingLeague.responses.AddBandResponse;
import com.example.FantasyPipingLeague.responses.ErrorResponse;
import com.example.FantasyPipingLeague.service.FantasyTeamService;

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
            FantasyTeam result = fantasyTeamService.addBandToTeam(
                    username,
                    request.getBandId(),
                    request.getJudgeType());

            System.out.println("Service call successful, creating response...");

            // Get the band that was just added based on judge type
            Band addedBand = getBandByJudgeType(result, request.getJudgeType());

            AddBandResponse response = new AddBandResponse(
                    "Band added successfully",
                    result.getId(),
                    addedBand != null ? addedBand.getBands() : "Unknown",
                    request.getJudgeType());

            System.out.println("SUCCESS: Returning response - " + response.getMessage());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("ERROR in addBandToTeam: " + e.getMessage());
            System.err.println("Exception type: " + e.getClass().getSimpleName());
            e.printStackTrace();

            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/remove-band")
    public ResponseEntity<?> removeBandFromTeam(@RequestBody Map<String, String> request, Authentication auth) {
        try {
            String judgeType = request.get("judgeType");
            String username = auth.getName();

            FantasyTeam team = fantasyTeamService.getFantasyTeamByUsername(username);
            if (team == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Fantasy team not found"));
            }

            switch (judgeType.toLowerCase()) {
                case "piping1" -> team.setPiping1Band(null);
                case "piping2" -> team.setPiping2Band(null);
                case "drumming" -> team.setDrummingBand(null);
                case "ensemble" -> team.setEnsembleBand(null);
                default -> {
                    return ResponseEntity.badRequest().body(new ErrorResponse("Invalid judge type"));
                }
            }

            fantasyTeamService.save(team);

            return ResponseEntity.ok(new AddBandResponse(
                    "Band removed successfully",
                    null,
                    null,
                    judgeType));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to remove band: " + e.getMessage()));
        }
    }

    @GetMapping("/my-team")
    public ResponseEntity<?> getMyTeam(Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Authentication required"));
            }

            String username = auth.getName();
            FantasyTeam team = fantasyTeamService.getFantasyTeamByUsername(username);

            if (team == null) {
                return ResponseEntity.ok(new HashMap<String, String>() {
                    {
                        put("message", "No fantasy team found for user");
                    }
                });
            }

            Map<String, Object> response = new HashMap<>();
            response.put("teamName", team.getTeamName());
            response.put("piping1Band", team.getPiping1Band());
            response.put("piping2Band", team.getPiping2Band());
            response.put("drummingBand", team.getDrummingBand());
            response.put("ensembleBand", team.getEnsembleBand());
            response.put("createdAt", team.getCreatedAt());
            response.put("updatedAt", team.getUpdatedAt());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("ERROR in getMyTeam: " + e.getMessage());
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

    private Band getBandByJudgeType(FantasyTeam team, String judgeType) {
        return switch (judgeType.toLowerCase()) {
            case "piping1", "piping_1" -> team.getPiping1Band();
            case "piping2", "piping_2" -> team.getPiping2Band();
            case "drumming" -> team.getDrummingBand();
            case "ensemble", "ensamble" -> team.getEnsembleBand();
            default -> null;
        };
    }
}
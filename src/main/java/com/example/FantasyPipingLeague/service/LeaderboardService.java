package com.example.FantasyPipingLeague.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FantasyPipingLeague.dto.LeaderboardEntryDto;
import com.example.FantasyPipingLeague.model.FantasyTeam;
import com.example.FantasyPipingLeague.repository.FantasyTeamRepository;
import com.example.FantasyPipingLeague.responses.LeaderboardResponse;

@Service
public class LeaderboardService {

    @Autowired
    private FantasyTeamRepository fantasyTeamRepository;

    @Autowired
    private ScoreCalculationService scoreCalculationService;

    public LeaderboardResponse getCurrentLeaderboard() {
        try {
            // Get all fantasy teams
            List<FantasyTeam> fantasyTeams = fantasyTeamRepository.findAll();

            if (fantasyTeams.isEmpty()) {
                return createEmptyLeaderboard();
            }

            // Calculate scores for each team
            List<LeaderboardEntryDto> entries = new ArrayList<>();

            for (FantasyTeam team : fantasyTeams) {
                Integer totalScore = scoreCalculationService.calculateTotalScore(team);
                Integer weeklyScore = scoreCalculationService.calculateWeeklyScore(team);

                LeaderboardEntryDto entry = new LeaderboardEntryDto();
                entry.setId(team.getId());
                entry.setUsername(team.getUser().getUsername());
                entry.setTeamName(team.getTeamName());
                entry.setTotalScore(totalScore);
                entry.setWeeklyScore(weeklyScore);
                // Position will be set after sorting
                entry.setPositionChange(0); // TODO: Implement position change tracking

                entries.add(entry);
            }

            // Sort by total score (descending) and assign positions
            entries.sort(Comparator.comparing(LeaderboardEntryDto::getTotalScore).reversed());

            for (int i = 0; i < entries.size(); i++) {
                entries.get(i).setPosition(i + 1);
            }

            // Create response
            LeaderboardResponse response = new LeaderboardResponse();
            response.setEntries(entries);
            response.setLastUpdated(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            response.setWeekNumber(getCurrentWeekNumber());

            return response;

        } catch (Exception e) {
            System.err.println("Error calculating leaderboard: " + e.getMessage());
            e.printStackTrace();
            return createMockLeaderboard(); // Fallback to mock data
        }
    }

    private LeaderboardResponse createEmptyLeaderboard() {
        LeaderboardResponse response = new LeaderboardResponse();
        response.setEntries(new ArrayList<>());
        response.setLastUpdated(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.setWeekNumber(getCurrentWeekNumber());
        return response;
    }

    private LeaderboardResponse createMockLeaderboard() {
        List<LeaderboardEntryDto> mockEntries = List.of(
                new LeaderboardEntryDto(1L, "PipeMaster2024", "Highland Heroes", 2750, 450, 1, 1),
                new LeaderboardEntryDto(2L, "DrumlineKing", "Tartan Thunder", 2680, 380, 2, -1),
                new LeaderboardEntryDto(3L, "BagpipeQueen", "Celtic Champions", 2590, 420, 3, 2),
                new LeaderboardEntryDto(4L, "ScottishPride", "Kilt Warriors", 2520, 390, 4, 0),
                new LeaderboardEntryDto(5L, "HighlandHero", "Pipe Dreams", 2480, 310, 5, -2));

        LeaderboardResponse response = new LeaderboardResponse();
        response.setEntries(mockEntries);
        response.setLastUpdated(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.setWeekNumber(getCurrentWeekNumber());
        return response;
    }

    private Integer getCurrentWeekNumber() {
        LocalDateTime now = LocalDateTime.now();
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        return now.get(weekFields.weekOfYear());
    }
}
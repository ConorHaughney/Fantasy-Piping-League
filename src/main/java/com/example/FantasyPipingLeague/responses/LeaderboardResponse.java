package com.example.FantasyPipingLeague.responses;

import java.util.List;

import com.example.FantasyPipingLeague.dto.LeaderboardEntryDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardResponse {
    private List<LeaderboardEntryDto> entries;
    private String lastUpdated;
    private Integer weekNumber;
}
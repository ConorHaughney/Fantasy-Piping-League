package com.example.FantasyPipingLeague.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private Long id;
    private String username;
    private String teamName;
    private Integer totalScore;
    private Integer weeklyScore;
    private Integer position;
    private Integer positionChange;
}
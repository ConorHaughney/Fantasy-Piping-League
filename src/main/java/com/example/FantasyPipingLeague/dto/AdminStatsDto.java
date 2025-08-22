package com.example.FantasyPipingLeague.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminStatsDto {
    private long totalUsers;
    private long totalTeams;
    private long totalBands;
    private long activeUsers;

    public AdminStatsDto(long totalUsers, long totalTeams, long totalBands, long activeUsers) {
        this.totalUsers = totalUsers;
        this.totalTeams = totalTeams;
        this.totalBands = totalBands;
        this.activeUsers = activeUsers;
    }
}
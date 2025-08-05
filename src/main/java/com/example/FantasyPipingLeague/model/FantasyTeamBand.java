package com.example.FantasyPipingLeague.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "fantasy_team_bands")
@Getter
@Setter
public class FantasyTeamBand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fantasy_team_id")
    private FantasyTeam fantasyTeam;

    @ManyToOne
    @JoinColumn(name = "band_id")
    private Band band;

    @Column(name = "judge_type")
    private String judgeType;

    // Constructors
    public FantasyTeamBand() {}

    public FantasyTeamBand(FantasyTeam fantasyTeam, Band band, String judgeType) {
        this.fantasyTeam = fantasyTeam;
        this.band = band;
        this.judgeType = judgeType;
    }
}
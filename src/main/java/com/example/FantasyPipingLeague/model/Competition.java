package com.example.FantasyPipingLeague.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "competitions")
@Getter
@Setter
public class Competition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "competition_id")
    private Long competitionId;

    @Column(name = "competition_name")
    private String competitionName;

    @Column(name = "competition_date")
    private LocalDate competitionDate;

    @Column(name = "major_minor")
    private Boolean majorMinor;

    @Column(name = "location")
    private String location;

    // One-to-many relationship with competition results
    @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CompetitionResult> competitionResults;
}
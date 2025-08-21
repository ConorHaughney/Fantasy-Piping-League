package com.example.FantasyPipingLeague.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "competitions")
@Getter
@Setter
public class Competitions {
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
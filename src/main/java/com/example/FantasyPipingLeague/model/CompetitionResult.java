package com.example.FantasyPipingLeague.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "competition_results")
@Getter
@Setter
public class CompetitionResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")  // Changed from competition_id
    private Long resultId;       // Changed from competitionId

    // Reference to the competition
    @ManyToOne
    @JoinColumn(name = "competition_id")
    private Competition competition;

    @Column(name = "grade")
    private Integer grade;  // 1, 2, 3, 4, etc.

    // One-to-many relationships for each judge type (fixed mappedBy)
    @OneToMany(mappedBy = "competitionResult", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PipingJudge1Result> pipingJudge1Results;

    @OneToMany(mappedBy = "competitionResult", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PipingJudge2Result> pipingJudge2Results;

    @OneToMany(mappedBy = "competitionResult", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DrummingJudgeResult> drummingJudgeResults;

    @OneToMany(mappedBy = "competitionResult", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EnsembleJudgeResult> ensembleJudgeResults;
}
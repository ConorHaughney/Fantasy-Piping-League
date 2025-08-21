package com.example.FantasyPipingLeague.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "competition_results")
@Getter
@Setter
public class CompetitionResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @ManyToOne
    @JoinColumn(name = "competition_id", nullable = false)
    private Competitions competition;

    @ManyToOne
    @JoinColumn(name = "band_id")
    private Band band;

    @Column(name = "piping_judge_1_score")
    private Long pipingJudge1Score;

    @Column(name = "piping_judge_2_score")
    private Long pipingJudge2Score;

    @Column(name = "drumming_judge_score")
    private Long drummingJudgeScore;

    @Column(name = "ensamble_judge_score")
    private Long ensembleJudgeScore;

    @Column(name = "total_score")
    private Integer totalScore;

    @Column(name = "position", nullable = false)
    private Long position = 0L;

    @Column(name = "on_ep", nullable = false)
    private Boolean onEp = false;

    // Constructors
    public CompetitionResult() {}

    public CompetitionResult(Competitions competition, Band band) {
        this.competition = competition;
        this.band = band;
    }
}
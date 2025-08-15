package com.example.FantasyPipingLeague.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ensemble_judge_results")
@Getter
@Setter
public class EnsembleJudgeResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "result_id")
    private CompetitionResult competitionResult;

    @ManyToOne
    @JoinColumn(name = "band_id")
    private Band band;

    @Column(name = "position")
    private Integer position;

    @Column(name = "judge_name")
    private String judgeName;
}
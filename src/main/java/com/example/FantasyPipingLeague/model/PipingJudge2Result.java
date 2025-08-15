package com.example.FantasyPipingLeague.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "piping_judge_2_results")
@Getter
@Setter
public class PipingJudge2Result {
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
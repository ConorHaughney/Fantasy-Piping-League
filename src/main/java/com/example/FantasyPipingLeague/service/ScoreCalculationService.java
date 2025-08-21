package com.example.FantasyPipingLeague.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FantasyPipingLeague.model.Band;
import com.example.FantasyPipingLeague.model.CompetitionResult;
import com.example.FantasyPipingLeague.model.FantasyTeam;
import com.example.FantasyPipingLeague.repository.CompetitionResultRepository;

@Service
public class ScoreCalculationService {

    @Autowired
    private CompetitionResultRepository competitionResultRepository;

    public Integer calculateTotalScore(FantasyTeam team) {
        Integer totalScore = 0;

        // Calculate scores for each judge type
        totalScore += calculateBandScore(team.getPiping1Band(), "piping");
        totalScore += calculateBandScore(team.getPiping2Band(), "piping");
        totalScore += calculateBandScore(team.getDrummingBand(), "drumming");
        totalScore += calculateBandScore(team.getEnsembleBand(), "ensemble");

        return totalScore;
    }

    public Integer calculateWeeklyScore(FantasyTeam team) {
        LocalDate weekStart = LocalDate.now().minusDays(7);
        Integer weeklyScore = 0;

        // Calculate scores for competitions in the last week
        weeklyScore += calculateBandScoreForPeriod(team.getPiping1Band(), "piping", weekStart);
        weeklyScore += calculateBandScoreForPeriod(team.getPiping2Band(), "piping", weekStart);
        weeklyScore += calculateBandScoreForPeriod(team.getDrummingBand(), "drumming", weekStart);
        weeklyScore += calculateBandScoreForPeriod(team.getEnsembleBand(), "ensemble", weekStart);

        return weeklyScore;
    }

    private Integer calculateBandScore(Band band, String judgeType) {
        if (band == null)
            return 0;

        // Get all competition results for this band
        List<CompetitionResult> results = competitionResultRepository.findByBand(band);

        Integer score = 0;
        for (CompetitionResult result : results) {
            score += calculateResultScore(result, judgeType);
        }

        return score;
    }

    private Integer calculateBandScoreForPeriod(Band band, String judgeType, LocalDate since) {
        if (band == null)
            return 0;

        // Get competition results since the specified date
        List<CompetitionResult> results = competitionResultRepository.findByBandAndCompetitionDateAfter(band, since);

        Integer score = 0;
        for (CompetitionResult result : results) {
            score += calculateResultScore(result, judgeType);
        }

        return score;
    }

    private Integer calculateResultScore(CompetitionResult result, String judgeType) {
        Integer score = 0;

        switch (judgeType.toLowerCase()) {
            case "piping":
                if (result.getPipingJudge1Score() != null) {
                    score += result.getPipingJudge1Score().intValue();
                }
                if (result.getPipingJudge2Score() != null) {
                    score += result.getPipingJudge2Score().intValue();
                }
                break;
            case "drumming":
                if (result.getDrummingJudgeScore() != null) {
                    score += result.getDrummingJudgeScore().intValue();
                }
                break;
            case "ensemble":
                if (result.getEnsembleJudgeScore() != null) {
                    score += result.getEnsembleJudgeScore().intValue();
                }
                break;
        }

        return score;
    }
}
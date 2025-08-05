package com.example.FantasyPipingLeague.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.FantasyPipingLeague.model.FantasyTeamBand;
import com.example.FantasyPipingLeague.model.FantasyTeam;
import com.example.FantasyPipingLeague.model.Band;

@Repository
public interface FantasyTeamBandRepository extends JpaRepository<FantasyTeamBand, Long> {
    boolean existsByFantasyTeamAndBandAndJudgeType(FantasyTeam fantasyTeam, Band band, String judgeType);

    Optional<FantasyTeamBand> findByFantasyTeamAndJudgeType(FantasyTeam fantasyTeam, String judgeType);
}
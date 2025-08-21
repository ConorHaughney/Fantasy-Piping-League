package com.example.FantasyPipingLeague.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.FantasyPipingLeague.model.Band;
import com.example.FantasyPipingLeague.model.CompetitionResult;

@Repository
public interface CompetitionResultRepository extends JpaRepository<CompetitionResult, Long> {

    List<CompetitionResult> findByBand(Band band);

    @Query("SELECT cr FROM CompetitionResult cr JOIN cr.competition c WHERE cr.band = :band AND c.competitionDate >= :since")
    List<CompetitionResult> findByBandAndCompetitionDateAfter(@Param("band") Band band,
            @Param("since") LocalDate since);
}
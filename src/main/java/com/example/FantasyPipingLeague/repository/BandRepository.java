package com.example.FantasyPipingLeague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.FantasyPipingLeague.model.Band;

@Repository
public interface BandRepository extends JpaRepository<Band, Long> {
}
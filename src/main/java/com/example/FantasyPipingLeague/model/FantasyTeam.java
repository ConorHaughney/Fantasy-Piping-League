package com.example.FantasyPipingLeague.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "fantasy_teams")
@Getter
@Setter
public class FantasyTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "team_name", nullable = false)
    private String teamName;

    @ManyToOne
    @JoinColumn(name = "piping_1_band_id")
    private Band piping1Band;

    @ManyToOne
    @JoinColumn(name = "piping_2_band_id")
    private Band piping2Band;

    @ManyToOne
    @JoinColumn(name = "drumming_band_id")
    private Band drummingBand;

    @ManyToOne
    @JoinColumn(name = "ensamble_band_id")
    private Band ensembleBand;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public FantasyTeam() {}

    public FantasyTeam(User user, String teamName) {
        this.user = user;
        this.teamName = teamName;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
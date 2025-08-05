package com.example.FantasyPipingLeague.model;

import jakarta.persistence.*;
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
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "team_name")
    private String teamName;

    // Constructors
    public FantasyTeam() {}

    public FantasyTeam(User user, String teamName) {
        this.user = user;
        this.teamName = teamName;
    }
}

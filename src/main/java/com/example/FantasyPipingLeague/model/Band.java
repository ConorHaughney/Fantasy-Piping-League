package com.example.FantasyPipingLeague.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bands", schema = "public")
@Getter
@Setter
public class Band {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bands")
    private String bands;

    @Column(name = "grade")
    private Integer grade;

    // Constructors
    public Band() {}

    public Band(String bands, Integer grade) {
        this.bands = bands;
        this.grade = grade;
    }
}
package com.example.FantasyPipingLeague.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    @Column(name = "points_cost")
    private Integer pointsCost;

    @Column(name = "logo_url")
    private String logoUrl;

    // Constructors
    public Band() {}

    public Band(String bands, Integer grade, Integer pointsCost, String logoUrl) {
        this.bands = bands;
        this.grade = grade;
        this.pointsCost = pointsCost;
        this.logoUrl = logoUrl;
    }
}
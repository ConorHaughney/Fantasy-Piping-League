package com.example.FantasyPipingLeague.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddBandDto {
    private Long bandId;
    private String judgeType;

    // Constructors
    public AddBandDto() {
    }

    public AddBandDto(Long bandId, String judgeType) {
        this.bandId = bandId;
        this.judgeType = judgeType;
    }
}

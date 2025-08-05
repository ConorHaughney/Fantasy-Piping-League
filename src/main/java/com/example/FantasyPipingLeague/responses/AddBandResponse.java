package com.example.FantasyPipingLeague.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddBandResponse {
    private String message;
    private Long fantasyTeamBandId;
    private String bandName;
    private String judgeType;

    public AddBandResponse(String message, Long fantasyTeamBandId, String bandName, String judgeType) {
        this.message = message;
        this.fantasyTeamBandId = fantasyTeamBandId;
        this.bandName = bandName;
        this.judgeType = judgeType;
    }
}

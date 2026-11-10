
package com.WomensSafety.womens_safety.dto;

import lombok.Data;

@Data
public class RiskMapResponse {

    private String geohashCell;
    private Double latitude;
    private Double longitude;
    private Double riskScore;
    private String riskLevel;

    public RiskMapResponse(
            String geohashCell,
            Double latitude,
            Double longitude,
            Double riskScore,
            String riskLevel) {

        this.geohashCell = geohashCell;
        this.latitude = latitude;
        this.longitude = longitude;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
    }
}

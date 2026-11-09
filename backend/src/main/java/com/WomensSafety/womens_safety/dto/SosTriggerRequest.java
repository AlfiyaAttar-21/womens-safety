package com.WomensSafety.womens_safety.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.Setter;

/** Both fields are optional: an SOS must work even when GPS is not available. */
@Getter @Setter
public class SosTriggerRequest {

    @DecimalMin("-90.0") @DecimalMax("90.0")
    private Double latitude;

    @DecimalMin("-180.0") @DecimalMax("180.0")
    private Double longitude;
}

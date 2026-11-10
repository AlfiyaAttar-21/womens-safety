
package com.WomensSafety.womens_safety.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.WomensSafety.womens_safety.dto.RiskMapResponse;
import com.WomensSafety.womens_safety.entity.GridCell;
import com.WomensSafety.womens_safety.repository.GridCellRepository;
import com.WomensSafety.womens_safety.service.RiskCalculationService;

@RestController
@RequestMapping("/api/risk-map")
public class RiskMapController {

    private final RiskCalculationService riskService;
    private final GridCellRepository gridCellRepository;

    public RiskMapController(
            RiskCalculationService riskService,
            GridCellRepository gridCellRepository) {

        this.riskService = riskService;
        this.gridCellRepository = gridCellRepository;
    }

    // Get calculated risk cells
    @GetMapping
    public ResponseEntity<List<RiskMapResponse>> getRiskMap() {

        List<GridCell> cells =
                gridCellRepository.findAllByOrderByRiskScoreDesc();

        List<RiskMapResponse> response = cells.stream()
                .filter(cell -> cell.getLatitude() != null
                        && cell.getLongitude() != null)
                .map(cell -> new RiskMapResponse(
                        cell.getGeohashCell(),
                        cell.getLatitude(),
                        cell.getLongitude(),
                        cell.getRiskScore(),
                        riskService.getRiskLevel(cell.getRiskScore())
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    // Calculate risk
    @PostMapping("/calculate")
    public ResponseEntity<String> calculateRisk() {

        riskService.calculateRisk();

        return ResponseEntity.ok(
                "Risk calculation completed successfully"
        );
    }
}

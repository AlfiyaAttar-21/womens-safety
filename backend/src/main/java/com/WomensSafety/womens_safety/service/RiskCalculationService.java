
package com.WomensSafety.womens_safety.service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.WomensSafety.womens_safety.entity.GridCell;
import com.WomensSafety.womens_safety.entity.Report;
import com.WomensSafety.womens_safety.repository.GridCellRepository;
import com.WomensSafety.womens_safety.repository.ReportRepository;

@Service
public class RiskCalculationService {

    private final ReportRepository reportRepository;
    private final GridCellRepository gridCellRepository;

    public RiskCalculationService(
            ReportRepository reportRepository,
            GridCellRepository gridCellRepository) {

        this.reportRepository = reportRepository;
        this.gridCellRepository = gridCellRepository;
    }

    @Transactional
    public void calculateRisk() {

        List<Report> reports =
                reportRepository.findByLatitudeIsNotNullAndLongitudeIsNotNull();

        Map<String, List<Report>> groupedReports = new HashMap<>();

        // Group reports using geohash
        for (Report report : reports) {

            if (report.getGeohash() == null ||
                    report.getGeohash().length() < 6) {
                continue;
            }

            String cell = report.getGeohash().substring(0, 6);

            groupedReports
                    .computeIfAbsent(cell, key -> new ArrayList<>())
                    .add(report);
        }

        // Calculate risk for each cell
        for (Map.Entry<String, List<Report>> entry
                : groupedReports.entrySet()) {

            String cell = entry.getKey();
            List<Report> cellReports = entry.getValue();

            double totalSeverity = 0;
            double totalWeight = 0;

            double totalLatitude = 0;
            double totalLongitude = 0;

            LocalDateTime now = LocalDateTime.now();

            for (Report report : cellReports) {

                double severity = report.getAiSeverityScore() == null
                        ? 50
                        : Math.max(0, Math.min(100,
                                report.getAiSeverityScore()));

                double weight = 1.0;

                if (report.getCreatedAt() != null) {

                    long days = Duration.between(
                            report.getCreatedAt(), now).toDays();

                    if (days >= 0 && days <= 7) {
                        weight = 1.5;
                    } else if (days <= 30 && days >= 0) {
                        weight = 1.2;
                    }
                }

                totalSeverity += severity * weight;
                totalWeight += weight;

                totalLatitude += report.getLatitude();
                totalLongitude += report.getLongitude();
            }

            double averageSeverity = totalWeight == 0
                    ? 0
                    : totalSeverity / totalWeight;

            double frequencyScore = Math.min(
                    cellReports.size() * 5.0, 30.0);

            double riskScore = Math.min(
                    100,
                    averageSeverity * 0.7 + frequencyScore
            );

            // Find existing cell or create new cell
            GridCell gridCell = gridCellRepository
                    .findByGeohashCell(cell)
                    .orElseGet(GridCell::new);

            // Save cell information
            gridCell.setGeohashCell(cell);

            gridCell.setRiskScore(
                    Math.round(riskScore * 100.0) / 100.0);

            // Save geographical center
            gridCell.setLatitude(
                    totalLatitude / cellReports.size());

            gridCell.setLongitude(
                    totalLongitude / cellReports.size());

            gridCell.setLastCalculatedAt(now);

            gridCellRepository.save(gridCell);
        }
    }

    public String getRiskLevel(Double riskScore) {

        if (riskScore == null) {
            return "NO_DATA";
        }

        if (riskScore < 30) {
            return "LOW";
        } else if (riskScore < 60) {
            return "MEDIUM";
        } else {
            return "HIGH";
        }
    }
}

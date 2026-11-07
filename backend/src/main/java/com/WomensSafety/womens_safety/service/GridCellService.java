package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.GridCell;
import com.WomensSafety.womens_safety.repository.GridCellRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GridCellService {

    @Autowired
    private GridCellRepository gridCellRepository;

    // Get risk score and details for a specific map grid cell
    public Optional<GridCell> getCellByGeohash(String geohashCell) {
        return gridCellRepository.findByGeohashCell(geohashCell);
    }

    // Get all grid cells for rendering the public risk heatmap
    public List<GridCell> getAllGridCells() {
        return gridCellRepository.findAll();
    }

    // Update or calculate risk score for a cell (used by your risk engine)
    public GridCell updateRiskScore(String geohashCell, Double riskScore) {
        GridCell cell = gridCellRepository.findByGeohashCell(geohashCell)
                .orElse(new GridCell());
        
        cell.setGeohashCell(geohashCell);
        cell.setRiskScore(riskScore);
        cell.setLastCalculatedAt(LocalDateTime.now());

        return gridCellRepository.save(cell);
    }
}

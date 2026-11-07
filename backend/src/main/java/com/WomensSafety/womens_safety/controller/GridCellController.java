package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.entity.GridCell;
import com.WomensSafety.womens_safety.service.GridCellService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grid-cells")
@CrossOrigin(origins = "*")
public class GridCellController {

    @Autowired
    private GridCellService gridCellService;

    // Get risk data for all grid cells (for map heatmap overlay)[cite: 5, 6]
    @GetMapping
    public ResponseEntity<List<GridCell>> getAllGridCells() {
        List<GridCell> cells = gridCellService.getAllGridCells();
        return ResponseEntity.ok(cells);
    }

    // Get risk score for a specific geohash cell
    @GetMapping("/{geohash}")
    public ResponseEntity<GridCell> getGridCellByGeohash(@PathVariable String geohash) {
        Optional<GridCell> cell = gridCellService.getCellByGeohash(geohash);
        if (cell.isPresent()) {
            return ResponseEntity.ok(cell.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
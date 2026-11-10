package com.WomensSafety.womens_safety.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.WomensSafety.womens_safety.entity.GridCell;

@Repository
public interface GridCellRepository extends JpaRepository<GridCell, Long> {

    Optional<GridCell> findByGeohashCell(String geohashCell);

    boolean existsByGeohashCell(String geohashCell);

    List<GridCell> findAllByOrderByRiskScoreDesc();
}
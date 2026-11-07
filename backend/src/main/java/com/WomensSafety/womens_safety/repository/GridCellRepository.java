package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.GridCell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GridCellRepository extends JpaRepository<GridCell, Long> {
    Optional<GridCell> findByGeohashCell(String geohashCell);
}

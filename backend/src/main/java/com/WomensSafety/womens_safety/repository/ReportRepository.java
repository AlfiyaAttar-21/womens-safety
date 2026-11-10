
package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByGeohash(String geohash);

    List<Report> findByUser_IdOrderByCreatedAtDesc(Long userId);
}

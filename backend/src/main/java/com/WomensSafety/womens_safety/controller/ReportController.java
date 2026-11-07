package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.entity.Report;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.ReportRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    // File an incident report (supports optional anonymous reporting)[cite: 5]
    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report, @RequestParam(required = false) Long userId) {
        if (userId != null) {
            Optional<User> userOpt = userRepository.findById(userId);
            userOpt.ifPresent(report::setUser);
        }

        // TODO: Send report text asynchronously to Google Gemini API for severity analysis[cite: 5, 8]
        Report savedReport = reportRepository.save(report);
        return ResponseEntity.ok(savedReport);
    }

    // Get reports by geohash cell for map views
    @GetMapping("/geohash/{geohash}")
    public ResponseEntity<List<Report>> getReportsByGeohash(@PathVariable String geohash) {
        List<Report> reports = reportRepository.findByGeohash(geohash);
        return ResponseEntity.ok(reports);
    }
}
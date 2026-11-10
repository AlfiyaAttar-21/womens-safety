
package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.entity.Report;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.service.ReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    private Long getUserId(Authentication auth) {
        Object principal = auth.getPrincipal();

        if (principal instanceof User) {
            User user = (User) principal;
            return user.getId();
        }

        throw new RuntimeException("Authenticated user not found");
    }

    @PostMapping
    public ResponseEntity<Report> createReport(
            Authentication auth,
            @RequestBody Report report) {

        Report savedReport = reportService.createReport(
                report, getUserId(auth));

        return ResponseEntity.ok(savedReport);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Report>> getMyReports(
            Authentication auth) {

        List<Report> reports =
                reportService.getReportsByUser(getUserId(auth));

        return ResponseEntity.ok(reports);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteReport(
            Authentication auth,
            @PathVariable Long id) {

        reportService.deleteReport(id, getUserId(auth));

        return ResponseEntity.ok(
                Map.of("message", "Report deleted successfully"));
    }

    @GetMapping("/geohash/{geohash}")
    public ResponseEntity<List<Report>> getReportsByGeohash(
            @PathVariable String geohash) {

        return ResponseEntity.ok(
                reportService.getReportsByGeohash(geohash));
    }
}

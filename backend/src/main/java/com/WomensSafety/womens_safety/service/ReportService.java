
package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.Report;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.ReportRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RiskCalculationService riskCalculationService;

    public Report createReport(Report report, Long userId) {

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "User not found"));

            report.setUser(user);
        }

        report.setId(null);

        Report savedReport = reportRepository.save(report);

        // Automatically calculate risk after saving report
        riskCalculationService.calculateRisk();

        return savedReport;
    }

    public List<Report> getReportsByUser(Long userId) {

        return reportRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    public List<Report> getReportsByGeohash(String geohash) {

        return reportRepository.findByGeohash(geohash);
    }

    @Transactional
    public void deleteReport(Long reportId, Long userId) {

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Report not found"));

        if (report.getUser() == null ||
                !report.getUser().getId().equals(userId)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "You cannot delete this report");
        }

        reportRepository.delete(report);
    }
}

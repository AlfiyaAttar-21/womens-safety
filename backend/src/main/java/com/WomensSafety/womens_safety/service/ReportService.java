package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.Report;
import com.WomensSafety.womens_safety.entity.User;
import com.WomensSafety.womens_safety.repository.ReportRepository;
import com.WomensSafety.womens_safety.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    public Report createReport(Report report, Long userId) {
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            report.setUser(user);
        }
        
        // TODO: Call Google Gemini API asynchronously here to analyze severity score[cite: 5, 8]
        
        return reportRepository.save(report);
    }

    public List<Report> getReportsByGeohash(String geohash) {
        return reportRepository.findByGeohash(geohash);
    }
}
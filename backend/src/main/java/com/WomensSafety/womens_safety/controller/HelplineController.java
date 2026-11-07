package com.WomensSafety.womens_safety.controller;

import com.WomensSafety.womens_safety.entity.Helpline;
import com.WomensSafety.womens_safety.repository.HelplineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/helplines")
@CrossOrigin(origins = "*")
public class HelplineController {

    @Autowired
    private HelplineRepository helplineRepository;

    // Get region-wise helplines[cite: 6]
    @GetMapping("/region/{region}")
    public ResponseEntity<List<Helpline>> getHelplinesByRegion(@PathVariable String region) {
        List<Helpline> helplines = helplineRepository.findByRegion(region);
        return ResponseEntity.ok(helplines);
    }

    // Add a new helpline entry (Admin utility)
    @PostMapping
    public ResponseEntity<Helpline> addHelpline(@RequestBody Helpline helpline) {
        Helpline savedHelpline = helplineRepository.save(helpline);
        return ResponseEntity.ok(savedHelpline);
    }
}

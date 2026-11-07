package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.Helpline;
import com.WomensSafety.womens_safety.repository.HelplineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HelplineService {

    @Autowired
    private HelplineRepository helplineRepository;

    // Get helplines by region[cite: 6]
    public List<Helpline> getHelplinesByRegion(String region) {
        return helplineRepository.findByRegion(region);
    }

    // Save a new helpline
    public Helpline addHelpline(Helpline helpline) {
        return helplineRepository.save(helpline);
    }
}
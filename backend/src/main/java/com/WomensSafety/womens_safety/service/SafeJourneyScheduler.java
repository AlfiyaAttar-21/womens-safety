

package com.WomensSafety.womens_safety.service;

import com.WomensSafety.womens_safety.entity.JourneyStatus;
import com.WomensSafety.womens_safety.entity.SafeJourney;
import com.WomensSafety.womens_safety.repository.JourneyRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SafeJourneyScheduler {

    private static final Logger logger =
            LoggerFactory.getLogger(SafeJourneyScheduler.class);

    private final JourneyRepository journeyRepository;
    private final SafeJourneyService safeJourneyService;

    public SafeJourneyScheduler(
            JourneyRepository journeyRepository,
            SafeJourneyService safeJourneyService) {
        this.journeyRepository = journeyRepository;
        this.safeJourneyService = safeJourneyService;
    }

    // Runs every 30 seconds
    @Scheduled(fixedDelay = 30000)
    public void checkMissedJourneys() {

        LocalDateTime now = LocalDateTime.now();

        List<SafeJourney> overdueJourneys =
                journeyRepository.findByStatusAndExpectedArrivalTimeBefore(
                        JourneyStatus.ACTIVE, now);

        for (SafeJourney journey : overdueJourneys) {
            try {
                safeJourneyService.triggerMissedJourneySos(journey.getId());

                logger.warn(
                        "SOS triggered for missed journey ID: {}",
                        journey.getId());

            } catch (Exception exception) {
                logger.error(
                        "Failed to process missed journey ID: {}",
                        journey.getId(), exception);
            }
        }
    }
}

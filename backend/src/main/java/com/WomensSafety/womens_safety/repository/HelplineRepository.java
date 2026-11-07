package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.Helpline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HelplineRepository extends JpaRepository<Helpline, Long> {
    List<Helpline> findByRegion(String region);
}
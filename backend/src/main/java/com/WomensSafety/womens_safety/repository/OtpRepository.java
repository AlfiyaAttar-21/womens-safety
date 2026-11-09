package com.WomensSafety.womens_safety.repository;
import com.WomensSafety.womens_safety.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByPhoneNumber(String phoneNumber);
}

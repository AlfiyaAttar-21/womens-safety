package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByUserId(Long userId);

    List<Contact> findByUserIdAndConsentStatus(Long userId, Contact.ConsentStatus consentStatus);

    long countByUserIdAndConsentStatusNot(Long userId, Contact.ConsentStatus consentStatus);

    boolean existsByUserIdAndPhone(Long userId, String phone);

    Optional<Contact> findByIdAndUserId(Long id, Long userId);

    Optional<Contact> findByConsentToken(String consentToken);
}

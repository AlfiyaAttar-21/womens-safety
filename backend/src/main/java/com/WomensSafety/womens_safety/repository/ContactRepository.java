package com.WomensSafety.womens_safety.repository;

import com.WomensSafety.womens_safety.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByUserId(Long userId);
    long countByUserId(Long userId);
}
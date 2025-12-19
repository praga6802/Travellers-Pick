package com.example.travellers_choice.repository;

import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.OTPVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OTPRepo extends JpaRepository<OTPVerification, Integer> {
    Optional<OTPVerification> findByUserAndPurpose(Customer user, String purpose);
    void deleteAllByUserAndPurpose(Customer user, String purpose);

}

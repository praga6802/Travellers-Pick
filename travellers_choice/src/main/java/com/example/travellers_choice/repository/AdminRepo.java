package com.example.travellers_choice.repository;

import com.example.travellers_choice.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepo extends JpaRepository<Admin,Integer> {



    Optional<Admin> findByEmailAndPassword(String email, String password);
    boolean existsByUsername(String username);
    //exists by username
    boolean existsByEmail(String email);
    boolean existsByContact(String contact);

    Optional<Admin> findByEmail(String email);
}

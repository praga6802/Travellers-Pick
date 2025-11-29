package com.example.travellers_choice.repository;

import com.example.travellers_choice.dto.UserDTO;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepo extends JpaRepository<Customer,Integer> {

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByContact(String contact);
    Optional<Customer> findByEmailAndPassword(String email, String password);

    Optional<Customer> findUserByEmail(String email);

    Optional<Customer> findByEmail(String email);
}

package com.example.travellers_choice.repository;

import com.example.travellers_choice.model.CustomerRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRegister extends JpaRepository<CustomerRegistry, Integer> {

    Optional<CustomerRegistry> findByPNR(String pnr);


    Long countByStatus(String confirmed);

    boolean existsByUser_Id(Integer id);

    List<CustomerRegistry> findByUser_Id(Integer id);
}

package com.example.travellers_choice.repository;

import com.example.travellers_choice.model.BookingRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRegistryRepository extends JpaRepository<BookingRegistry, Integer> {

    Optional<BookingRegistry> findByPNR(String pnr);


    Long countByStatus(String confirmed);

    boolean existsByUser_Id(Integer id);

    List<BookingRegistry> findByUser_Id(Integer id);
}

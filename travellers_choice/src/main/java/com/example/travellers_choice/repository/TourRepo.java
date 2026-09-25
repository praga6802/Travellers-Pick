package com.example.travellers_choice.repository;

import com.example.travellers_choice.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface TourRepo extends JpaRepository<Tour, Integer> {

    Optional<Tour> findByTourName(String tourName);

    List<Tour> findByPackages_PackageId(Integer packageId);
}

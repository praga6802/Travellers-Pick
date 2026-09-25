package com.example.travellers_choice.repository;

import com.example.travellers_choice.dto.DayDTO;
import com.example.travellers_choice.model.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItineraryRepository extends JpaRepository<Itinerary,Integer> {
    List<DayDTO> findByTourIdAndPackagesId(int tourId, int packageId);

    Optional<Itinerary> findByPackagesPackageIdAndTourTourIdAndDay(Integer packageId, Integer tourId, Integer day);
}

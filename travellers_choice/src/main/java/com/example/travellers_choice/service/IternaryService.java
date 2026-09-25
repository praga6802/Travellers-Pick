package com.example.travellers_choice.service;

import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.model.Itinerary;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.model.Tour;
import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.repository.ItineraryRepository;
import com.example.travellers_choice.repository.PackageRepo;
import com.example.travellers_choice.repository.TourRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class IternaryService {

    @Autowired
    PackageRepo packagesRepo;

    @Autowired
    TourRepo tourRepo;

    @Autowired
    ItineraryRepository itineraryRepository;


    // add itinerary
    public ResponseEntity<?> addItinerary(AddItineraryDTO addItineraryDTO) {
        Tour tour = tourRepo.findById(addItineraryDTO.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        Packages pkg = packagesRepo.findById(addItineraryDTO.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        Itinerary itinerary = new Itinerary();
        itinerary.setDay(addItineraryDTO.getDay());
        itinerary.setDescription(addItineraryDTO.getDescription());
        itinerary.setDestination(addItineraryDTO.getDestination());
        itinerary.setTour(tour);
        itinerary.setPackages(pkg);

        itineraryRepository.save(itinerary);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Itinerary added successfully"));

    }


    // update itinerary
    public ResponseEntity<?> updateItinerary(UpdateItineraryDTO updateItineraryDTO){

        Itinerary itinerary = itineraryRepository.findById(updateItineraryDTO.getItineraryId())
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        Tour tour = tourRepo.findById(updateItineraryDTO.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        Packages pkg = packagesRepo.findById(updateItineraryDTO.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        itinerary.setTour(tour);
        itinerary.setPackages(pkg);
        itinerary.setDay(updateItineraryDTO.getDay());
        itinerary.setDestination(updateItineraryDTO.getDestination());
        itinerary.setDescription(updateItineraryDTO.getDescription());

        itineraryRepository.save(itinerary);

        return ResponseEntity.ok("Itinerary updated successfully");
    }

    // to display in admin view itineraries
    public List<SendIternaryDTO> allItineraries() {
        return itineraryRepository.findAll().stream()
                .map(it-> new SendIternaryDTO(it.getTour().getTourId(),
                        it.getDay(),it.getDestination(), it.getDescription(),
                        it.getPackages().getPackageName(),
                        it.getTour().getTourName())).toList();
    }


    // get day list by package id and tour id
    public ResponseEntity<?> getDayInformation(Integer packageId, Integer tourId) {
        Packages packages = packagesRepo.findById(packageId).orElseThrow(() -> new RuntimeException("Package not found"));

        Tour tour = tourRepo.findById(tourId) .orElseThrow(() -> new RuntimeException("Tour not found"));

        if (tour.getPackages() == null || !Objects.equals(tour.getPackages().getPackageId(), packages.getPackageId())) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AResponse(
                            LocalDateTime.now(),"Failed", "Tour does not belong to the selected package"));
        }

        List<DayDTO> day = itineraryRepository.findByTour_TourIdAndPackages_PackageId(tour.getTourId(),packages.getPackageId());

        if(day.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AResponse(
                            LocalDateTime.now(),
                            "Failed",
                            "No days found"
                    ));
        }
        return ResponseEntity.ok(day);

    }

    public ResponseEntity<?> getItinerary(Integer packageId, Integer tourId, Integer day) {

        Itinerary itinerary = itineraryRepository
                .findByPackages_PackageIdAndTour_TourIdAndDay(packageId, tourId, day)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        ItineraryDTO dto = new ItineraryDTO();
        dto.setDay(itinerary.getDay());
        dto.setDestination(itinerary.getDestination());
        dto.setDescription(itinerary.getDescription());
        return ResponseEntity.ok(dto);
    }
}

package com.example.travellers_choice.service;

import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.ResourceNotFoundException;
import com.example.travellers_choice.model.Itinerary;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.model.Tour;
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
    public ResponseEntity<AResponse> addItinerary(Integer packageId, Integer tourId, ItineraryDTO addItineraryDTO) {

        Packages pkg = packagesRepo.findById(packageId).orElseThrow(() -> new RuntimeException("Package not found"));

        Tour tour = tourRepo.findById(packageId).orElseThrow(() -> new RuntimeException("Tour not found"));

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
    public ResponseEntity<AResponse> updateItinerary(Integer packageId, Integer tourId,Integer itineraryId, ItineraryDTO itineraryDTO){
        Packages pkg = packagesRepo.findById(packageId).orElseThrow(() -> new RuntimeException("Package not found"));
        Tour tour = tourRepo.findById(tourId).orElseThrow(() -> new RuntimeException("Tour not found"));
        Itinerary itinerary = itineraryRepository.findById(packageId).orElseThrow(()-> new IDNotFoundException("Itinerary ID not found",packageId));
        
        itinerary.setTour(tour);
        itinerary.setPackages(pkg);
        itinerary.setDay(itineraryDTO.getDay());
        itinerary.setDestination(itineraryDTO.getDestination());
        itinerary.setDescription(itineraryDTO.getDescription());

        itineraryRepository.save(itinerary);

        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Itinerary updated successfully"));
    }

    // Delete Itinerary
    public ResponseEntity<AResponse> deleteItinerary(DeleteItineraryDTO dto) {

        Itinerary itinerary = itineraryRepository.findById(dto.getItineraryId()).orElseThrow(() -> new IDNotFoundException("Itinerary not found", dto.getItineraryId()));
        itineraryRepository.delete(itinerary);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Itinerary deleted successfully"));
    }

    //get all Itineraries
    public ResponseEntity<AResponse> getItineraries() {
        List<Itinerary> itineraries= itineraryRepository.findAll();

        if(itineraries.isEmpty()){
            throw new ResourceNotFoundException("Itineraries");
        }
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",itineraries));
    }


    // get days by package id and tour id
    public ResponseEntity<AResponse> getDay(Integer packageId, Integer tourId) {
        Packages packages = packagesRepo.findById(packageId).orElseThrow(() -> new RuntimeException("Package not found"));

        Tour tour = tourRepo.findById(tourId) .orElseThrow(() -> new RuntimeException("Tour not found"));

        if (tour.getPackages() == null || !Objects.equals(tour.getPackages().getPackageId(), packages.getPackageId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AResponse(
                            LocalDateTime.now(),"Failed", "Tour does not belong to the selected package"));
        }

        List<Itinerary> itineraries = itineraryRepository.findByTour_TourIdAndPackages_PackageId(tour.getTourId(),packages.getPackageId());

        if(itineraries.isEmpty()){
            throw new ResourceNotFoundException("Itineraries");
        }

        List<DayDTO> days = itineraries.stream().map(it-> new DayDTO(it.getDay())).toList();

        if(days.isEmpty()){
            throw new ResourceNotFoundException("Days");
        }

        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",days));

    }

    //get itinerary by package,tour and day
    public ResponseEntity<AResponse> getItinerary(Integer packageId, Integer tourId, Integer day) {

        Itinerary itinerary = itineraryRepository
                .findByPackages_PackageIdAndTour_TourIdAndDay(packageId, tourId, day)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary"));

        ItineraryDTO dto = new ItineraryDTO();
        dto.setItineraryId(itinerary.getId());
        dto.setDay(itinerary.getDay());
        dto.setDestination(itinerary.getDestination());
        dto.setDescription(itinerary.getDescription());
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",dto));
    }

    //booking form itinerary data
    public ResponseEntity<AResponse> getItinerariesByTourId(Integer tourId) {

        tourRepo.findById(tourId).orElseThrow(()-> new IDNotFoundException("Tour ID",tourId));
        List<Itinerary> itineraries = itineraryRepository.findByTour_TourId(tourId);

        if(itineraries.isEmpty()){
            throw new ResourceNotFoundException("Itineraries");
        }

        List<ItineraryDTO> itineraryList = itineraries.stream()
                .map(itinerary -> new ItineraryDTO(itinerary.getId(),itinerary.getDay(),itinerary.getDestination(),itinerary.getDescription())).toList();

        if(itineraryList.isEmpty()){
           throw  new ResourceNotFoundException("For this tour, Itineraries");
        }

        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",itineraryList));
    }
}

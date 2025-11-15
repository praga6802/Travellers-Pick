package com.example.travellers_choice.service;


import com.example.travellers_choice.dto.UserDTO;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.PackageNameNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.ApiResponse;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.model.Tour;
import com.example.travellers_choice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TourService {


    @Autowired
    TourRepo tourRepo;

    @Autowired
    PackageRepo packageRepo;

    @Autowired
    AdminRepo adminRepo;

    @Autowired
    CustomerRegister customerRepo;

    //add tour by all admin credentials
    public ResponseEntity<?> addTour(int packageName, Tour tour, int adminId, String password) {

        Packages packageEntity = packageRepo.findById(packageName).orElseThrow(() -> new PackageNameNotFoundException("Package Name",String.valueOf(packageName)));

        Admin exisitingAdmin= adminRepo.findById(adminId).orElseThrow(()-> new IDNotFoundException("ID",adminId));

        if(!exisitingAdmin.getPassword().equals(password)){
            throw new UnAuthorizedException("Password",password);
        }

        tour.setPackageName(packageEntity);
        tourRepo.save(tour);
        return ResponseEntity.ok(new ApiResponse("Tour Updated Successfully","200",LocalDateTime.now()));

    }

    //update tour by all admin credentials
    public ResponseEntity<?> updateTour(int packageId, Tour tour, int adminId, String password) {

        Packages packageEntity = packageRepo.findById(packageId).orElseThrow(() -> new PackageNameNotFoundException("Package Name", String.valueOf(packageId)));
        Tour tourEntity = tourRepo.findById(tour.getTourId()).orElseThrow(() -> new IDNotFoundException("Tour ID", tour.getTourId()));
        Admin exisitingAdmin = adminRepo.findById(adminId).orElseThrow(() -> new IDNotFoundException("ID", adminId));

        if (!exisitingAdmin.getPassword().equals(password)) {
            throw new UnAuthorizedException("Password", password);
        }

        if (tour.getTourName() != null && !tour.getTourName().isBlank())
            tourEntity.setTourName(tour.getTourName());

        if (tour.getTourSlogan() != null && !tour.getTourSlogan().isBlank())
            tourEntity.setTourSlogan(tour.getTourSlogan());

        if (tour.getPlaces() != null && !tour.getPlaces().isBlank())
            tourEntity.setPlaces(tour.getPlaces());

        if (tour.getDays()!=null)
            tourEntity.setDays(tour.getDays());

        if (tour.getNights() != null)
            tourEntity.setNights(tour.getNights());

        if (tour.getPrice() != null)
            tourEntity.setPrice(tour.getPrice());

        tourRepo.save(tourEntity);
        return ResponseEntity.ok(new ApiResponse("Tour Updated Successfully","200",LocalDateTime.now()));

    }

    //delete tour by all admin credentials
    public ResponseEntity<?> deleteTour(int packageId, int tourId, int adminID, String password) {
        Packages packageEntity = packageRepo.findById(packageId).orElseThrow(() -> new PackageNameNotFoundException("Package Name", String.valueOf(packageId)));
        Tour tourEntity = tourRepo.findById(tourId).orElseThrow(() -> new IDNotFoundException("Tour ID", tourId));
        Admin exisitingAdmin = adminRepo.findById(adminID).orElseThrow(() -> new IDNotFoundException("Admin ID", adminID));

        if (!exisitingAdmin.getPassword().equals(password)) {
            throw new UnAuthorizedException("Invalid Password", password);
        }

        tourRepo.delete(tourEntity);
        return ResponseEntity.ok(new ApiResponse("Tour Deleted Successfully","200",LocalDateTime.now()));

    }

    //get all tour list
    public List<Tour> getAllTours() {
        return tourRepo.findAll();
    }


    //get tour by ID
    public ResponseEntity<?> getTourByID(Integer packageID,Integer tourID){

        Packages existingID=packageRepo.findById(packageID).orElseThrow(()-> new IDNotFoundException("Package ID",packageID));
        Tour tour=existingID.getTours().stream().
                filter(t->t.getTourId()==(tourID)).findFirst().
                orElseThrow(()->new IDNotFoundException("Tour ID '",tourID));
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("Package ID",packageID);
        response.put("Tour ID",tourID);
        response.put("Tour Name",tour.getTourName());
        response.put("Tour Slogan",tour.getTourSlogan());
        response.put("Price",tour.getPrice());
        response.put("Name",tour.getTourName());
        response.put("Places",tour.getPlaces());
        response.put("Days",tour.getDays());
        response.put("Nights",tour.getNights());
        return ResponseEntity.ok(response);


    }



}

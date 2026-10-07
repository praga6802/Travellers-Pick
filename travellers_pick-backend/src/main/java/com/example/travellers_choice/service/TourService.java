package com.example.travellers_choice.service;


import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.exception.BusinessException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.ResourceNotFoundException;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.model.Tour;
import com.example.travellers_choice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TourService {


    @Autowired
    private TourRepo tourRepo;

    @Autowired
    private PackageRepo packageRepo;

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private CloudinaryService cloudinaryService;


    //add tour
    public ResponseEntity<AResponse> addTour(Integer packageId, UpdateTourDTO tourDTO) {

        Packages pkg = packageRepo.findById(packageId).orElseThrow(() -> new IDNotFoundException("Package ID",packageId));
        MultipartFile image = tourDTO.getImageFile();
        String imgUrl = cloudinaryService.uploadImage(image,"tours");

        Tour tour = new Tour();
        tour.setPackages(pkg);
        tour.setTourName(tourDTO.getTourName());
        tour.setTourSlogan(tourDTO.getTourSlogan());
        tour.setPlaces(tourDTO.getPlaces());
        tour.setDays(tourDTO.getDays());
        tour.setNights(tourDTO.getNights());
        tour.setPrice(tourDTO.getPrice());
        tour.setImgUrl(imgUrl);
        tourRepo.save(tour);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Added Successfully"));
    }

    //update tour by all admin credentials
    public ResponseEntity<AResponse> updateTour(Integer packageId, Integer tourId, UpdateTourDTO categoryDTO) {
        Packages pkg=packageRepo.findById(packageId).orElseThrow(()->new IDNotFoundException("Package ID",packageId));
        Tour tour = tourRepo.findById(tourId).orElseThrow(() -> new IDNotFoundException("Tour ID", tourId));

        if(tour.getPackages().getPackageId()!=pkg.getPackageId()) {
            throw new BusinessException("Tour ID not belongs to Package ID");
        }

        if (categoryDTO.getTourName() != null && !categoryDTO.getTourName().isBlank())
            tour.setTourName(categoryDTO.getTourName());

        if (categoryDTO.getTourSlogan() != null && !categoryDTO.getTourSlogan().isBlank())
            tour.setTourSlogan(categoryDTO.getTourSlogan());

        if (categoryDTO.getPlaces() != null && !categoryDTO.getPlaces().isBlank())
            tour.setPlaces(categoryDTO.getPlaces());

        if (categoryDTO.getDays()!=null)
            tour.setDays(categoryDTO.getDays());

        if (categoryDTO.getNights() != null)
            tour.setNights(categoryDTO.getNights());

        if (categoryDTO.getPrice() != null)
            tour.setPrice(categoryDTO.getPrice());

        if(categoryDTO.getImageFile()!=null && !categoryDTO.getImageFile().isEmpty()){
            MultipartFile image = categoryDTO.getImageFile();
            String imgUrl = cloudinaryService.uploadImage(image,"tours");
            tour.setImgUrl(imgUrl);
        }
        tourRepo.save(tour);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Updated Successfully"));
    }

    //delete tour by admin
    public ResponseEntity<AResponse> deleteTour(Integer packageId, Integer tourId) {
        Packages packages = packageRepo.findById(packageId).orElseThrow(()-> new IDNotFoundException("Package ID",packageId));
        Tour tour = tourRepo.findById(tourId).orElseThrow(() -> new IDNotFoundException("Tour ID", tourId));
        if(tour.getPackages().getPackageId()!= packages.getPackageId()){
            throw new BusinessException("Tour not belongs this package");
        }
        tourRepo.delete(tour);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Deleted Successfully"));
    }


    //get tour list
    public ResponseEntity<AResponse> getAllTours(){
        List<Tour> tours = tourRepo.findAll();
        List<UpdateCategoryDTO> dtoList = tours.stream().map(tour->{
            String fileName="booking-form.html?packageId="+tour.getPackages().getPackageId() + "&tourId=" +tour.getTourId();
            return new UpdateCategoryDTO(
                    tour.getPackages().getPackageId(),
                    tour.getTourId(),
                    tour.getTourName(),
                    tour.getTourSlogan(),
                    tour.getPlaces(),
                    tour.getDays(),
                    tour.getNights(),
                    tour.getPrice(),
                    tour.getImgUrl(),
                    fileName
            );
        }).toList();

        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",dtoList));
    }


    //get tour by ID
    public ResponseEntity<AResponse> getTourByID(Integer packageID,Integer tourID){

        Packages existingPackage=packageRepo.findById(packageID).orElseThrow(()-> new IDNotFoundException("Package ID",packageID));

        Tour tour=tourRepo.findById(tourID).orElseThrow(()-> new IDNotFoundException("Tour ID",tourID));

        if (tour.getPackages() == null ||
                !Objects.equals(
                        tour.getPackages().getPackageId(),
                        existingPackage.getPackageId())) {

            throw new ResourceNotFoundException("Tour is not belongs to this package");
        }

        TourDetailDTO tourDetails = new TourDetailDTO(tour.getTourName(),tour.getTourSlogan(),tour.getPlaces(),tour.getDays(),tour.getNights(),tour.getPrice());
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",tourDetails));
    }


    // get tours list by package ID
    public ResponseEntity<AResponse> getToursByPackageId(Integer packageId) {
            List<Tour> tours = tourRepo.findByPackages_PackageId(packageId);
            List<TourInfoDTO> tourInfoDTOS = tours.stream().map(tour -> new TourInfoDTO(tour.getTourId(), tour.getTourName())).toList();
            return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",tourInfoDTOS));
    }

}

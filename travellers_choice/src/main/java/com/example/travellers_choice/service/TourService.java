package com.example.travellers_choice.service;


import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
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
    TourRepo tourRepo;

    @Autowired
    PackageRepo packageRepo;

    @Autowired
    AdminRepo adminRepo;

    @Autowired
    CustomerRegister customerRepo;

    //add tour by all admin credentials
    public ResponseEntity<?> addTour(UploadCategoryDTO tourDTO, String email) {

        Packages pkg = packageRepo.findById(tourDTO.getPackageId()).orElseThrow(() -> new IDNotFoundException("Package ID",tourDTO.getPackageId()));

        MultipartFile image = tourDTO.getImageFile();

        String dirPath = "/app/uploads/tours";
        File dir= new File(dirPath);
        if(!dir.exists())dir.mkdirs();

        String fileName=image.getOriginalFilename();
        File destination=new File(dir,fileName);
        try{
            image.transferTo(destination);
        }
        catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AResponse(LocalDateTime.now(),"Failure","Failed to Upload Tour Image!"));
        }

        Tour tour = new Tour();
        tour.setPackages(pkg);
        tour.setTourName(tourDTO.getTourName());
        tour.setTourSlogan(tourDTO.getTourSlogan());
        tour.setPlaces(tourDTO.getPlaces());
        tour.setDays(tourDTO.getDays());
        tour.setNights(tourDTO.getNights());
        tour.setPrice(tourDTO.getPrice());
        tour.setImgUrl("/uploads/tours/"+fileName);
        tourRepo.save(tour);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Added Successfully"));
    }

    //update tour by all admin credentials
    public ResponseEntity<?> updateTour(UploadCategoryDTO categoryDTO, String email) {
        Admin exisitingAdmin = adminRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Admin Email", email));

        Packages pkg=packageRepo.findById(categoryDTO.getPackageId()).orElseThrow(()->new IDNotFoundException("Package ID",categoryDTO.getPackageId()));

        Tour tourEntity = tourRepo.findById(categoryDTO.getTourId())
                .orElseThrow(() -> new IDNotFoundException("Tour ID", categoryDTO.getTourId()));

        if(tourEntity.getPackages().getPackageId()!=pkg.getPackageId() || categoryDTO.getTourId()!=tourEntity.getTourId()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).
                    body(new AResponse(LocalDateTime.now(),"Failure","Tour ID not belongs to Package ID"));
        }

        if (categoryDTO.getTourName() != null && !categoryDTO.getTourName().isBlank())
            tourEntity.setTourName(categoryDTO.getTourName());

        if (categoryDTO.getTourSlogan() != null && !categoryDTO.getTourSlogan().isBlank())
            tourEntity.setTourSlogan(categoryDTO.getTourSlogan());

        if (categoryDTO.getPlaces() != null && !categoryDTO.getPlaces().isBlank())
            tourEntity.setPlaces(categoryDTO.getPlaces());

        if (categoryDTO.getDays()!=null)
            tourEntity.setDays(categoryDTO.getDays());

        if (categoryDTO.getNights() != null)
            tourEntity.setNights(categoryDTO.getNights());

        if (categoryDTO.getPrice() != null)
            tourEntity.setPrice(categoryDTO.getPrice());

        if(categoryDTO.getImageFile()!=null && !categoryDTO.getImageFile().isEmpty()){
            MultipartFile image = categoryDTO.getImageFile();
            String path = "/app/uploads/tours";
            File folder = new File(path);
            if (!folder.exists()) folder.mkdirs();

            String fileName = image.getOriginalFilename();
            File file = new File(folder, fileName);
            if (categoryDTO.getImageFile() != null && !categoryDTO.getImageFile().isEmpty()) {
                tourEntity.setImgUrl("/uploads/tours/" + fileName);
            }
            try{
                image.transferTo(file);
            }
            catch (IOException e){
                System.out.println(e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AResponse(LocalDateTime.now(),"Failure","Failed to Update Tour Image!"));
            }
        }

        tourRepo.save(tourEntity);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Updated Successfully"));
    }

    //delete tour by admin
    public ResponseEntity<?> deleteTour(DeleteTourDTO dto, String email) {
        Admin exisitingAdmin = adminRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Admin Email", email));
        Tour tourEntity = tourRepo.findById(dto.getTourId()).orElseThrow(() -> new IDNotFoundException("Tour ID", dto.getTourId()));

        tourRepo.delete(tourEntity);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Deleted Successfully"));
    }


    //get list of tours in page
    public List<UpdateCategoryDTO> getAllTours(){
        return tourRepo.findAll().stream().map(tour->{
            String fileName="booking-form.html?tourId="+tour.getTourId();

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
    }


    //get tour by ID
    public ResponseEntity<?> getTourByID(Integer packageID,Integer tourID){

        Packages existingPackage=packageRepo.findById(packageID).orElseThrow(()-> new IDNotFoundException("Package ID",packageID));

        Tour tour=tourRepo.findById(tourID).orElseThrow(()-> new IDNotFoundException("Tour ID",tourID));

        if (tour.getPackages() == null ||
                !Objects.equals(
                        tour.getPackages().getPackageId(),
                        existingPackage.getPackageId())) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AResponse(
                            LocalDateTime.now(),
                            "Failed",
                            "Tour does not belong to the selected package"
                    ));
        }
        TourDetailDTO tourDetails = new TourDetailDTO(tour.getTourName(),tour.getTourSlogan(),tour.getPlaces(),tour.getDays(),tour.getNights(),tour.getPrice());
        return ResponseEntity.ok(tourDetails);
    }


    public List<TourInfoDTO> getTourInfo(Integer packageId) {

            List<Tour> tours = tourRepo.findByPackages_PackageId(packageId);

            return tours.stream()
                    .map(tour -> new TourInfoDTO(
                            tour.getTourId(),
                            tour.getTourName()
                    ))
                    .toList();
    }

}

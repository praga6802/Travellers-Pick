package com.example.travellers_choice.service;


import com.example.travellers_choice.dto.AResponse;
import com.example.travellers_choice.dto.UploadCategoryDTO;
import com.example.travellers_choice.dto.DeleteTourDTO;
import com.example.travellers_choice.dto.UpdateCategoryDTO;
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
    public ResponseEntity<?> addCategory(UploadCategoryDTO categoryDTO, String email) {
        Admin exisitingAdmin= adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Admin Email",email));

        Packages pkg = packageRepo.findById(categoryDTO.getPackageId())
                .orElseThrow(() -> new IDNotFoundException("Package ID",categoryDTO.getPackageId()));

        MultipartFile image = categoryDTO.getImageFile();
        String path = "C:/Users/praga/OneDrive/Documents/Java Projects/travellers-choice/travellers-main/images";
        File dir= new File(path);
        if(!dir.exists())dir.mkdirs();

        String fileName=image.getOriginalFilename();
        File destination=new File(dir,fileName);
        try{
            image.transferTo(destination);
        }
        catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AResponse(LocalDateTime.now(),"Failure","Failed to Upload Image!"));
        }

        Tour tour = new Tour();
        tour.setPackageName(pkg);
        tour.setTourName(categoryDTO.getTourName());
        tour.setTourSlogan(categoryDTO.getTourSlogan());
        tour.setPlaces(categoryDTO.getPlaces());
        tour.setDays(categoryDTO.getDays());
        tour.setNights(categoryDTO.getNights());
        tour.setPrice(categoryDTO.getPrice());
        tour.setImgUrl("images/"+fileName);
        tourRepo.save(tour);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Added Successfully"));
    }

    //update tour by all admin credentials
    public ResponseEntity<?> updateCategory(UploadCategoryDTO categoryDTO, String email) {
        Admin exisitingAdmin = adminRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Admin Email", email));

        Packages pkg=packageRepo.findById(categoryDTO.getPackageId()).orElseThrow(()->new IDNotFoundException("Package ID",categoryDTO.getPackageId()));

        Tour tourEntity = tourRepo.findById(categoryDTO.getTourId())
                .orElseThrow(() -> new IDNotFoundException("Tour ID", categoryDTO.getTourId()));

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
            String path = "C:/Users/praga/OneDrive/Documents/Java Projects/travellers-choice/travellers-main/images";
            File folder = new File(path);
            if (!folder.exists()) folder.mkdirs();

            String fileName = image.getOriginalFilename();
            File file = new File(folder, fileName);
            if (categoryDTO.getImageFile() != null && !categoryDTO.getImageFile().isEmpty()) {
                tourEntity.setImgUrl("images/" + fileName);
            }
        }

        tourRepo.save(tourEntity);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Updated Successfully"));
    }

    //delete tour by all admin credentials
    public ResponseEntity<?> deleteCategory(DeleteTourDTO dto, String email) {
        Admin exisitingAdmin = adminRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Admin Email", email));
        Tour tourEntity = tourRepo.findById(dto.getTourId()).orElseThrow(() -> new IDNotFoundException("Tour ID", dto.getTourId()));

        tourRepo.delete(tourEntity);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Deleted Successfully"));
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

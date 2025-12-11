package com.example.travellers_choice.service;


import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.repository.PackageRepo;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PackageService {

    @Autowired
    PackageRepo packageRepo;

    @Autowired
    AdminRepo adminRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private ServletContext servletContext;


    //add package
    public ResponseEntity<?> addPackage(PackageUploadDTO packageDTO, String email) {
        Admin exisitingAdmin=adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Admin Email)",email));

        if (packageRepo.existsByPackageName(packageDTO.getPackageName())) {
            return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).
                    body(new AResponse(LocalDateTime.now(),"Failure","Package Already Added"));
        }
        MultipartFile image=packageDTO.getImageFile();
        String path = "C:/Users/praga/OneDrive/Documents/Java Projects/travellers-choice/travellers-main/images";
        File dir=new File(path);
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

        Packages newPackage = new Packages();
        newPackage.setPackageName(packageDTO.getPackageName());
        newPackage.setPackageSlogan(packageDTO.getPackageSlogan());
        newPackage.setImgUrl("images/"+fileName);
        packageRepo.save(newPackage);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Package Added Successfully"));
    }


    //update package
    public ResponseEntity<?> updatePackage(UpdatePackageDTO updatePackageDTO, String email) {
        Packages existingPackage=packageRepo.findById(updatePackageDTO.getPackageId()).orElseThrow(()->new IDNotFoundException("Package ID",updatePackageDTO.getPackageId()));
        Admin exisitingAdmin=adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Admin Email",email));

        // update only if new values are provided
        if (updatePackageDTO.getPackageName() != null && !updatePackageDTO.getPackageName().isBlank()) {
            existingPackage.setPackageName(updatePackageDTO.getPackageName());
        }

        if (updatePackageDTO.getPackageSlogan() != null && !updatePackageDTO.getPackageSlogan().isBlank()) {
            existingPackage.setPackageSlogan(updatePackageDTO.getPackageSlogan());
        }

        if(updatePackageDTO.getImageFile()!=null && !updatePackageDTO.getImageFile().isEmpty()) {
            MultipartFile image = updatePackageDTO.getImageFile();
            String path = "C:/Users/praga/OneDrive/Documents/Java Projects/travellers-choice/travellers-main/images";
            File folder = new File(path);
            if (!folder.exists()) folder.mkdirs();

            String fileName = image.getOriginalFilename();
            File file = new File(folder, fileName);
            if (updatePackageDTO.getImageFile() != null && !updatePackageDTO.getImageFile().isEmpty()) {
                existingPackage.setImgUrl("images/" + fileName);
            }
        }
        packageRepo.save(existingPackage);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Package Updated Successfully"));
    }

    //delete package
    public ResponseEntity<?> deletePackage(Integer packageId, String email) {
        Packages existingPackage= packageRepo.findById(packageId).orElseThrow(()-> new IDNotFoundException("Package ID",packageId));
        Admin existingAdmin= adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Admin Email",email));
        packageRepo.delete(existingPackage);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Package Deleted Successfully"));
    }

    public List<PackageDTO> getAllPackages(){
        return packageRepo.findAll().stream().map(pkg-> {
            String fileName= pkg.getPackageName().split(" ")[0].toLowerCase()+".html";
                return new PackageDTO(pkg.getPackageId(),pkg.getPackageName(),pkg.getPackageSlogan(),pkg.getImgUrl(),fileName);
        }).toList();
    }


    //get Package by Id
    public ResponseEntity<?> getPackageById(Integer pkgId){
        Packages pkgid=packageRepo.findById(pkgId).orElseThrow(()-> new IDNotFoundException("Package Id",pkgId));
        Map<String, Object> response= new LinkedHashMap<>();
        response.put("Package ID",pkgid.getPackageId());
        response.put("Package Name",pkgid.getPackageName());
        response.put("Package Slogan",pkgid.getPackageSlogan());
        return ResponseEntity.ok(response);
    }

    public List<PackageInfoDTO> getAllPackageNames() {
        return packageRepo.findAll().stream()
                .map(pkg->new PackageInfoDTO(pkg.getPackageId(), pkg.getPackageName()))
                .toList();
    }

}

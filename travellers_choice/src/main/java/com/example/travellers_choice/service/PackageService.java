package com.example.travellers_choice.service;


import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.exception.*;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.repository.PackageRepo;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PackageService {

    @Autowired
    PackageRepo packageRepo;


    //add package
    public ResponseEntity<AResponse> addPackage(PackageUploadDTO packageDTO){
        if (packageRepo.existsByPackageName(packageDTO.getPackageName())) {
            throw new AlreadyExistsException(packageDTO.getPackageName(),"Package Already Exists");
        }

        MultipartFile image=packageDTO.getImageFile();

        String dirPath = "/app/uploads/packages";
        File dir=new File(dirPath);

        if (!dir.exists() && !dir.mkdirs()) {
            throw new BusinessException("Failed to create upload Repository!");
        }

        String fileName=image.getOriginalFilename();
        File destination=new File(dir,fileName);

        try{
            image.transferTo(destination);
        }
        catch (Exception e){
            throw new BusinessException("Failed to Upload Package Image!");
        }

        Packages newPackage = new Packages();
        newPackage.setPackageName(packageDTO.getPackageName());
        newPackage.setPackageSlogan(packageDTO.getPackageSlogan());
        newPackage.setImgUrl("/uploads/packages/"+fileName);
        packageRepo.save(newPackage);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Package Added Successfully"));
    }


    //update package
    public ResponseEntity<AResponse> updatePackage(Integer packageId, UpdatePackageDTO updatePackageDTO) {
        Packages existingPackage=packageRepo.findById(packageId).orElseThrow(()->new IDNotFoundException("Package ID",packageId));

        if (updatePackageDTO.getPackageName() != null && !updatePackageDTO.getPackageName().isBlank()) {
            existingPackage.setPackageName(updatePackageDTO.getPackageName());
        }

        if (updatePackageDTO.getPackageSlogan() != null && !updatePackageDTO.getPackageSlogan().isBlank()) {
            existingPackage.setPackageSlogan(updatePackageDTO.getPackageSlogan());
        }

        if(updatePackageDTO.getImageFile()!=null && !updatePackageDTO.getImageFile().isEmpty()) {
            MultipartFile image = updatePackageDTO.getImageFile();
            String path = "uploads/packages";
            File folder = new File(path);
            if (!folder.exists()) folder.mkdirs();

            String fileName = image.getOriginalFilename();
            File file = new File(folder, fileName);
            if (updatePackageDTO.getImageFile() != null && !updatePackageDTO.getImageFile().isEmpty()) {
                existingPackage.setImgUrl("/uploads/packages/" + fileName);
            }

            try{
                image.transferTo(file);
            }
            catch (IOException e){
                throw new BusinessException("Failed to Update Package Image!");
            }
        }
        packageRepo.save(existingPackage);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Package Updated Successfully"));
    }

    //delete package
    public ResponseEntity<AResponse> deletePackage(Integer packageId) {
        Packages existingPackage= packageRepo.findById(packageId).orElseThrow(()-> new IDNotFoundException("Package ID",packageId));
        packageRepo.delete(existingPackage);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Package Deleted Successfully"));
    }

    // get all package list
    public ResponseEntity<AResponse> getAllPackages(){

        List<Packages> packages = packageRepo.findAll();
        if(packages.isEmpty()){
            throw new ResourceNotFoundException("Packages");
        }
        List<PackageDTO> packageDTOS = packages.stream().map(pkg-> {
            String fileName= pkg.getPackageName().split(" ")[1].toLowerCase()+"-package.html";
                return new PackageDTO(pkg.getPackageId(),pkg.getPackageName(),pkg.getPackageSlogan(),pkg.getImgUrl(),fileName);
        }).toList();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",packageDTOS));
    }


    //get Package by Id
    public ResponseEntity<AResponse> getPackageById(Integer pkgId){
        Packages pkgid=packageRepo.findById(pkgId).orElseThrow(()-> new IDNotFoundException("Package Id",pkgId));
        Map<String, Object> response= new LinkedHashMap<>();
        response.put("packageId",pkgid.getPackageId());
        response.put("packageName",pkgid.getPackageName());
        response.put("packageSlogan",pkgid.getPackageSlogan());
        response.put("imgFile",pkgid.getImgUrl());
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",response));
    }


    //get all package names for selecting
    public ResponseEntity<AResponse> getAllPackageNames() {

        List<Packages> packages = packageRepo.findAll();
        if(packages.isEmpty()){
            throw new ResourceNotFoundException("Packages");
        }

        List<PackageInfoDTO> packageInfoDTOS = packages.stream()
                .map(pkg->new PackageInfoDTO(pkg.getPackageId(), pkg.getPackageName()))
                .toList();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",packageInfoDTOS));

    }

}

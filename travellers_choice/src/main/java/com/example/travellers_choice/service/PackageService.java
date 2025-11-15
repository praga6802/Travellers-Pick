package com.example.travellers_choice.service;


import com.example.travellers_choice.exception.AlreadyExistsException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.ApiResponse;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.repository.PackageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PackageService {

    @Autowired
    PackageRepo packageRepo;

    @Autowired
    AdminRepo adminRepo;


    //add package
    public ResponseEntity<?> addPackage(Packages packages, Admin admin) {
        if (packageRepo.existsByPackageName(packages.getPackageName())) {
            throw new AlreadyExistsException("Package Name",packages.getPackageName());
        }
        Admin exisitingAdmin=adminRepo.findById(admin.getAdminId()).orElseThrow(()-> new IDNotFoundException("Admin ID",admin.getAdminId()));
        if(!exisitingAdmin.getPassword().equals(admin.getPassword())){
            throw new UnAuthorizedException("Password",admin.getPassword());
        }
        packageRepo.save(packages);
        return ResponseEntity.ok(new ApiResponse("Package Added Successfully","200",LocalDateTime.now()));
    }

    // it will return all the package details


    public ResponseEntity<?> updatePackage(Packages p1, Admin admin) {
        Packages existingPackage=packageRepo.findById(p1.getPackageId()).orElseThrow(()->new IDNotFoundException("Package ID",p1.getPackageId()));
        Admin exisitingAdmin=adminRepo.findById(admin.getAdminId()).orElseThrow(()-> new IDNotFoundException("Admin ID",admin.getAdminId()));

        if(!exisitingAdmin.getPassword().equals(admin.getPassword())){
            throw new UnAuthorizedException("Password",admin.getPassword());
        }

        // update only if new values are provided
        if (p1.getPackageName() != null && !p1.getPackageName().isBlank()) {
            existingPackage.setPackageName(p1.getPackageName());
        }

        if (p1.getPackageSlogan() != null && !p1.getPackageSlogan().isBlank()) {
            existingPackage.setPackageSlogan(p1.getPackageSlogan());
        }
        packageRepo.save(existingPackage);
        return ResponseEntity.ok(new ApiResponse("Package Updated Successfully","200",LocalDateTime.now()));
    }



    public ResponseEntity<?> deletePackage(Packages packages, Admin admin) {
        Packages exisitingPackage= packageRepo.findById(packages.getPackageId()).orElseThrow(()-> new IDNotFoundException("Package ID",packages.getPackageId()));
        Admin existingAdmin= adminRepo.findById(admin.getAdminId()).orElseThrow(()-> new IDNotFoundException("Admin ID",admin.getAdminId()));

        if(!existingAdmin.getPassword().equals(admin.getPassword())){
            throw new UnAuthorizedException("Admin Password",admin.getPassword());
        }
        packageRepo.delete(exisitingPackage);
        return ResponseEntity.ok( new ApiResponse("Package Deleted Successfully","200", LocalDateTime.now()));
    }

    public List<Packages> getAllPackages(){
        return packageRepo.findAll();
    }


    //get Package by Id
    public ResponseEntity<?> getPackageById(Integer pkgId){
        Packages pkgid=packageRepo.findById(pkgId).orElseThrow(()-> new IDNotFoundException("Package Id",pkgId));
        Map response= new LinkedHashMap();
        response.put("Package ID",pkgid.getPackageId());
        response.put("Package Name",pkgid.getPackageName());
        response.put("Package Slogan",pkgid.getPackageSlogan());
        return ResponseEntity.ok(response);
    }


    public ResponseEntity<?> getPackageNames(){
        Map<Integer,String> response= packageRepo.findAll().stream().
        collect(Collectors.toMap(
                Packages::getPackageId,
                Packages::getPackageName,
                (a,b)->a,
                LinkedHashMap::new
        ));
        return ResponseEntity.ok(response);
    }
}

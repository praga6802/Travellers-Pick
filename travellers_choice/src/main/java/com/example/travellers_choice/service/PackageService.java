package com.example.travellers_choice.service;


import com.example.travellers_choice.exception.AlreadyExistsException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.repository.PackageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PackageService {

    @Autowired
    PackageRepo packageRepo;

    @Autowired
    AdminRepo adminRepo;

    public Packages addPackage(Packages packages, Admin admin) {
        if (packageRepo.existsByPackageName(packages.getPackageName())) {
            throw new AlreadyExistsException("Package Name",packages.getPackageName());
        }
        Admin exisitingAdmin=adminRepo.findById(admin.getAdminId()).orElseThrow(()-> new IDNotFoundException("Admin ID",admin.getAdminId()));
        if(!exisitingAdmin.getPassword().equals(admin.getPassword())){
            throw new UnAuthorizedException("Password",admin.getPassword());
        }
        return packageRepo.save(packages);
    }

    // it will return all the package details
    public List<Packages> getAllPackages(){
        return packageRepo.findAll();
    }

    public Packages updatePackage(Packages p1, Admin admin) {
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
       return packageRepo.save(existingPackage);
    }



    public boolean deletePackage(Packages packages, Admin admin) {
        Packages exisitingPackage= packageRepo.findById(packages.getPackageId()).orElseThrow(()-> new IDNotFoundException("Package ID",packages.getPackageId()));
        Admin existingAdmin= adminRepo.findById(admin.getAdminId()).orElseThrow(()-> new IDNotFoundException("Admin ID",admin.getAdminId()));

        if(!existingAdmin.getPassword().equals(admin.getPassword())){
            throw new UnAuthorizedException("Admin Password",admin.getPassword());
        }
        packageRepo.delete(exisitingPackage);
        return true;
    }


    //get Package by Id
    public Packages getPackageById(Integer pkgId){
        return packageRepo.findById(pkgId).orElseThrow(()->new IDNotFoundException("Package ID",pkgId));
    }


    public List<String> getAllPackageNames(){
        return packageRepo.findAll().stream().
                map(Packages::getPackageName).collect(Collectors.toList());
    }
}

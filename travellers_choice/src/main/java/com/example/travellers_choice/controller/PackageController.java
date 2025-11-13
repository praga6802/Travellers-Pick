package com.example.travellers_choice.controller;

import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/package")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class PackageController {

    @Autowired
    PackageService packageService;


    //add package
    @PostMapping("/addpackage")
    public ResponseEntity<?> addPackage(@ModelAttribute Packages packages,@ModelAttribute Admin admin){
        Packages p1 = packageService.addPackage(packages, admin);
        Map<String, String> response=new HashMap<>();
        response.put("message","Package Added Successfully");
        return ResponseEntity.ok(response);
    }


    //update package
    @PutMapping("/updatepackage")
    public ResponseEntity<?> updatePackage(@ModelAttribute Packages packages,@ModelAttribute Admin admin) {
        Packages p1 = packageService.updatePackage(packages, admin);
        return ResponseEntity.ok(Map.of("message", "Package Updated Successfully"));
    }


    //get all packages
    @GetMapping("/allpackages")
    public ResponseEntity<List<Packages>> getAllPackages(){
        List<Packages> listPackages=packageService.getAllPackages();
        return ResponseEntity.ok(listPackages);
    }

    //delete package
    @DeleteMapping("/deletepackage")
    public ResponseEntity<?> deletePackage(@ModelAttribute Packages packages, @ModelAttribute Admin admin){
        boolean deletePackage=packageService.deletePackage(packages,admin);
        return ResponseEntity.ok(Map.of("message","Package Deleted Successfully"));
    }



    @GetMapping("/getPackage/{package_id}")
    public ResponseEntity<?> getPackageById(@PathVariable Integer package_id){
        Packages pkg=packageService.getPackageById(package_id);
        return ResponseEntity.ok(pkg);
    }


}

package com.example.travellers_choice.controller;

import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.model.*;
import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.service.AdminService;
import com.example.travellers_choice.service.PackageService;
import com.example.travellers_choice.service.TourService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {


    @Autowired
    AdminService adminService;

    @Autowired
    PackageService packageService;

    @Autowired
    TourService tourService;


                                            // --- ADMIN ---
    //sign up admin
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Admin admin){
        return adminService.signUp(admin);
    }

    //login admin
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginDTO loginData, HttpSession session) {
        return adminService.adminLogin(loginData.getEmail(),loginData.getPassword(),session);
    }

    //get the current admin
    @GetMapping("/current-admin")
    public ResponseEntity<?> getCurrentAdmin(HttpSession session) {
        Admin admin=(Admin) session.getAttribute("LoggedAdmin");
        if(admin==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
           .body(new AResponse(LocalDateTime.now(),"Failure","No Active Session user"));
        }
        return ResponseEntity.ok(Map.of(
                "adminId", admin.getAdminId(),
                "adminUserName", admin.getUsername(),
                "adminEmail",admin.getEmail(),
                "adminContact",admin.getContact()
        ));
    }


    //logout admin
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session){
       return adminService.logout(session);
    }


    // UPDATE ADMIN
    @PostMapping("/updateAdmin")
    public ResponseEntity<?> updateAdmin(@RequestBody AdminDTO admin, @AuthenticationPrincipal UserDetails user){
        String email=user.getUsername();
        System.out.println("EMAIL:"+email+" with data"+"DATA"+admin);
        return adminService.updateAdmin(admin,email);
    }


    //DELETE ADMIN
    @DeleteMapping("/deleteAdmin")
    public ResponseEntity<?> deleteAdmin(@RequestBody DeleteAdminDTO deleteAdminDTO){
        return adminService.deleteAdmin(deleteAdminDTO.getAdminId(), deleteAdminDTO.getPassword());
    }


    //VIEW ADMIN
    @GetMapping("/alladmins")
    public ResponseEntity<List<Admin>> getAllAdmins(){
        List<Admin> allAdmins= adminService.getAllAdmins();
        return ResponseEntity.ok(allAdmins);
    }


    //GET ADMIN BY ID
    @GetMapping("/getadmin/{adminId}")
    public ResponseEntity<?> getAdmin(@PathVariable("adminId") Integer adminid){
        return adminService.getAdmin(adminid);
    }

    @GetMapping("/adminData")
    public ResponseEntity<?> adminData(@AuthenticationPrincipal UserDetails userDetails){
        if(userDetails==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).
                    body(new AResponse(LocalDateTime.now(),"Failure","Network Error or Session Expired! Please try again"));
        }
        return adminService.adminData(userDetails.getUsername());
    }


                                                    // --- CUSTOMERS --
    // get all tour register customers
    @GetMapping("/allregusers")
    public ResponseEntity<List<CustomerRegistry>> getAllUsers(){
        List<CustomerRegistry> allUsers= adminService.getAllRegUsers();
        return ResponseEntity.ok(allUsers);
    }


    //get all signup users
    @GetMapping("/allusers")
    public ResponseEntity<List<Customer>> getAllCustomers(){
        List<Customer> allCustomers= adminService.getAllCustomers();
        return ResponseEntity.ok(allCustomers);
    }



                                                    // --- PACKAGE ---
    //ADD PACKAGE BY PACKAGE AND ADMIN CREDENTIALS
    @PostMapping("/addPackage")
    public ResponseEntity<?> addPackage(@RequestBody PackageDTO packageDTO, @AuthenticationPrincipal UserDetails user){
      return packageService.addPackage(packageDTO, user.getUsername());
    }


    //UPDATE PACKAGE BY PACKAGE AND ADMIN CREDENTIALS
    @PutMapping("/updatePackage")
    public ResponseEntity<?> updatePackage(@RequestBody UpdatePackageDTO updatePackageDTO, @AuthenticationPrincipal UserDetails user) {
        return packageService.updatePackage(updatePackageDTO, user.getUsername());
    }

    //DELETE PACKAGE BY PACKAGE AND ADMIN CREDENTIALS
    @DeleteMapping("/deletePackage")
    public ResponseEntity<?> deletePackage(@RequestBody DeletePackageDTO deletePackageDTO, @AuthenticationPrincipal UserDetails user){
         return packageService.deletePackage(deletePackageDTO.getPackageId(),user.getUsername());
    }

    //GET ALL PACKAGES
    @GetMapping("/packages")
    public ResponseEntity<?> getAllPackages(){
        List<Packages> listPackages=packageService.getAllPackages();
        return ResponseEntity.ok(listPackages);
    }

    @GetMapping("/packageNames")
    public ResponseEntity<?> getAllPackageNames(){
        List<PackageInfoDTO> packageNames=packageService.getAllPackageNames();
        return ResponseEntity.ok(packageNames);
    }

    //GET PACKAGE BY ID
    @GetMapping("/getPackage/{package_id}")
    public ResponseEntity<?> getPackageById(@PathVariable Integer package_id){
        return packageService.getPackageById(package_id);
    }


                                                        //  --- TOUR ---
    //ADD TOUR
    @PostMapping("/addCategory")
    public ResponseEntity<?> addCategory(@RequestBody CategoryDTO categoryDTO, @AuthenticationPrincipal UserDetails userDetails){
        return tourService.addCategory(categoryDTO,userDetails.getUsername());
    }

    // UPDATE TOUR
    @PutMapping("/updateCategory")
    public ResponseEntity<?> updateCategory(@RequestBody UpdateCategoryDTO categoryDTO, @AuthenticationPrincipal UserDetails userDetails){
        return tourService.updateCategory(categoryDTO,userDetails.getUsername());
    }

    // DELETE TOUR
    @DeleteMapping("/deleteCategory")
    public ResponseEntity<?> deleteCategory(@RequestBody DeleteTourDTO dto, @AuthenticationPrincipal UserDetails userDetails){
        return tourService.deleteCategory(dto, userDetails.getUsername());
    }

    // GET ALL TOURS
    @GetMapping("/allCategories")
    public ResponseEntity<List<Tour>> getAllTours(){
        List<Tour> allTours=tourService.getAllTours();
        return ResponseEntity.ok(allTours);
    }


    // GET TOUR BY ID
    @GetMapping("/getTour/{packageID}/{tourID}")
    public ResponseEntity<?> getTourById(@PathVariable Integer packageID,@PathVariable Integer tourID){
        return tourService.getTourByID(packageID,tourID);
    }

}

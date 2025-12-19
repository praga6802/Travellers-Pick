package com.example.travellers_choice.controller;

import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.model.*;
import com.example.travellers_choice.service.AdminService;
import com.example.travellers_choice.service.IternaryService;
import com.example.travellers_choice.service.PackageService;
import com.example.travellers_choice.service.TourService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @Autowired
    IternaryService iternaryService;


                                            // --- ADMIN ---
    //sign up admin
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Admin admin){
        return adminService.signUp(admin);
    }

    //login admin
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginDTO loginData, HttpSession session) {
        System.out.println("hit");
        return adminService.adminLogin(loginData.getEmail(),loginData.getPassword(),session);
    }

    //get the current admin
    @GetMapping("/current-admin")
    public ResponseEntity<?> getCurrentAdmin(@AuthenticationPrincipal UserDetails userDetails) {
        return adminService.getCurrentAdmin(userDetails);
    }

    //logout admin
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails, HttpSession session){
       return adminService.logout(userDetails,session);
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
    public ResponseEntity<List<BookedUserDTO>> getAllUsers(){
        List<BookedUserDTO> allUsers= adminService.getAllRegUsers();
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
    @PostMapping(value = "/addPackage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPackage(@ModelAttribute PackageUploadDTO dto, @AuthenticationPrincipal UserDetails user){
      return packageService.addPackage(dto, user.getUsername());
    }


    //UPDATE PACKAGE BY PACKAGE AND ADMIN CREDENTIALS
    @PostMapping(value = "/updatePackage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePackage(@ModelAttribute UpdatePackageDTO updatePackageDTO, @AuthenticationPrincipal UserDetails user) {
        return packageService.updatePackage(updatePackageDTO, user.getUsername());
    }

    //DELETE PACKAGE BY PACKAGE AND ADMIN CREDENTIALS
    @DeleteMapping("/deletePackage")
    public ResponseEntity<?> deletePackage(@RequestBody DeletePackageDTO deletePackageDTO, @AuthenticationPrincipal UserDetails user){
         return packageService.deletePackage(deletePackageDTO.getPackageId(),user.getUsername());
    }

    //GET ALL PACKAGES
    @GetMapping("/allPackages")
    public ResponseEntity<?> getAllPackages(){
        List<PackageDTO> listPackages=packageService.getAllPackages();
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
    @PostMapping(value = "/addCategory",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addCategory(@ModelAttribute UploadCategoryDTO categoryDTO, @AuthenticationPrincipal UserDetails userDetails){
        return tourService.addCategory(categoryDTO,userDetails.getUsername());
    }

    // UPDATE TOUR
    @PostMapping(value = "/updateCategory", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCategory(@ModelAttribute UploadCategoryDTO categoryDTO, @AuthenticationPrincipal UserDetails userDetails){
        return tourService.updateCategory(categoryDTO,userDetails.getUsername());
    }

    // DELETE TOUR
    @DeleteMapping("/deleteCategory")
    public ResponseEntity<?> deleteCategory(@RequestBody DeleteTourDTO dto, @AuthenticationPrincipal UserDetails userDetails){
        return tourService.deleteCategory(dto, userDetails.getUsername());
    }

    //GET ALL TOURS
    @GetMapping("/allCategories")
    public ResponseEntity<List<UpdateCategoryDTO>> getAllTours(){
        List<UpdateCategoryDTO> allTours=tourService.getAllTours();
        return ResponseEntity.ok(allTours);
    }


    // GET TOUR BY ID
    @GetMapping("/getTour/{packageID}/{tourID}")
    public ResponseEntity<?> getTourById(@PathVariable Integer packageID,@PathVariable Integer tourID){
        return tourService.getTourByID(packageID,tourID);
    }


    // ITERNARY
    //add iternary
    @PostMapping("/addIternary")
    public ResponseEntity<?> addIternary(@RequestBody AddIternaryDTO addIternaryDTO, @AuthenticationPrincipal UserDetails userDetails){
        if(userDetails==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AResponse(LocalDateTime.now(),"Failure","Network Error or Session Expired! Please try again"));
        }
        return iternaryService.addIternary(addIternaryDTO,userDetails.getUsername());
    }


    @GetMapping("/allIternaries")
    public ResponseEntity<List<SendIternaryDTO>> allIternaries(){
        List<SendIternaryDTO> iternaryList= iternaryService.allIternaries();
        return ResponseEntity.ok(iternaryList);
    }
}

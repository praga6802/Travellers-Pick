package com.example.travellers_choice.controller;

import com.example.travellers_choice.dto.DeleteAdminDTO;
import com.example.travellers_choice.model.*;
import com.example.travellers_choice.service.AdminService;
import com.example.travellers_choice.service.PackageService;
import com.example.travellers_choice.service.TourService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
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
    //SIGN UP ADMIN
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Admin admin){
        return adminService.signUp(admin);
    }

    //LOGIN ADMIN
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Admin adminLogin, HttpSession httpSession){
        ResponseEntity<?> response=adminService.adminLogin(adminLogin.getEmail(),adminLogin.getPassword());
        Admin admin=adminService.getAdminByEmail(adminLogin.getEmail());
        httpSession.setAttribute("LoggedAdmin",admin);
        return response;
    }

    @GetMapping("/current-admin")
    public ResponseEntity<?> getUsername(HttpSession session){
        Admin admin=(Admin)session.getAttribute("LoggedAdmin");

        if(admin!=null){
            Map<String,Object> response= new HashMap<>();
            response.put("adminId",admin.getAdminId());
            response.put("Active User",admin.getUsername());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","No active Session"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request){
        return adminService.logout(request);
    }


    // UPDATE ADMIN
    @PostMapping("/updateadmin")
    public ResponseEntity<?> updateAdmin(@RequestBody Admin admin){
        return adminService.updateAdmin(admin);
    }


    //DELETE ADMIN
    @DeleteMapping("/deleteadmin")
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
    @PostMapping("/addpackage")
    public ResponseEntity<?> addPackage(@ModelAttribute Packages packages, @ModelAttribute Admin admin){
      return packageService.addPackage(packages, admin);
    }


    //UPDATE PACKAGE BY PACKAGE AND ADMIN CREDENTIALS
    @PutMapping("/updatepackage")
    public ResponseEntity<?> updatePackage(@ModelAttribute Packages packages,@ModelAttribute Admin admin) {
        return packageService.updatePackage(packages, admin);
    }

    //DELETE PACKAGE BY PACKAGE AND ADMIN CREDENTIALS
    @DeleteMapping("/deletepackage")
    public ResponseEntity<?> deletePackage(@ModelAttribute Packages packages, @ModelAttribute Admin admin){
         return packageService.deletePackage(packages,admin);
    }

    //GET ALL PACKAGES
    @GetMapping("/packages")
    public ResponseEntity<?> getAllPackages(){
        List<Packages> listPackages=packageService.getAllPackages();
        return ResponseEntity.ok(listPackages);
    }

    @GetMapping("/getPackageNames")
    public ResponseEntity<?> getPackageNames(){
        return packageService.getPackageNames();
    }

    //GET PACKAGE BY ID
    @GetMapping("/getPackage/{package_id}")
    public ResponseEntity<?> getPackageById(@PathVariable Integer package_id){
        return packageService.getPackageById(package_id);
    }


                                                        //  --- TOUR ---
    //ADD TOUR
    @PostMapping("/addtour")
    public ResponseEntity<?> addTour(@RequestParam("packageName")int packageName, @ModelAttribute Tour tour, @RequestParam("adminId") int adminId,
                                     @RequestParam("password") String password){
        return tourService.addTour(packageName,tour,adminId, password);
    }

    // UPDATE TOUR
    @PutMapping("/updatetour")
    public ResponseEntity<?> updateTour(@RequestParam("packageName")int packageId, @ModelAttribute Tour tour, @RequestParam("adminId") int adminId,
                                        @RequestParam("password") String password){
        return tourService.updateTour(packageId,tour,adminId, password);
    }

    // DELETE TOUR
    @DeleteMapping("/deletetour")
    public ResponseEntity<?> deleteTour(@RequestParam("packageName") int packageId, @RequestParam("tourId") int tourId, @RequestParam("adminId")int adminID,
                                                         @RequestParam("password") String password){
        return tourService.deleteTour(packageId, tourId,adminID,password);
    }

    // GET ALL TOURS
    @GetMapping("/alltours")
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

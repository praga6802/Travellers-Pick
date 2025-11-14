package com.example.travellers_choice.controller;

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

import java.util.HashMap;
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
    @PostMapping("/adminsignup")
    public ResponseEntity<String> signUp(@RequestBody Admin admin){
        Admin saveAdmin=adminService.signUp(admin);
        return ResponseEntity.ok("SignUp Successful");
    }

    //LOGIN ADMIN
    @PostMapping("/adminlogin")
    public ResponseEntity<?> adminLogin(@RequestBody Admin adminLogin, HttpSession httpSession){
        System.out.println("ADMIN LOGIN API HIT");
        String email=adminLogin.getEmail();
        String password=adminLogin.getPassword();
        Admin admin=adminService.adminLogin(email,password);
        if(admin!=null){
            httpSession.setAttribute("LoggedAdmin",admin);

            Map<String, Object> response=new HashMap<>();
            response.put("adminId",admin.getAdminId());
            response.put("adminUserName",admin.getUsername());
            response.put("message","Login Successful");
            return ResponseEntity.ok(response);
        }
        Map<String,Object> error=new HashMap<>();
        error.put("error","Invalid Credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response){
        request.getSession().invalidate();
        return ResponseEntity.ok("Logged Out");
    }

    @GetMapping("/current-admin")
    public ResponseEntity<?> getUsername(HttpSession session){
        Admin admin=(Admin)session.getAttribute("LoggedAdmin");

        if(admin!=null){
            Map<String,Object> response= new HashMap<>();
            response.put("adminId",admin.getAdminId());
            response.put("adminUserName",admin.getUsername());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","No active Session"));
    }


    // UPDATE ADMIN
    @PostMapping("/updateadmin")
    public ResponseEntity<Map<String, String>> updateAdmin(@RequestBody Admin admin){
        adminService.updateAdmin(admin);
        return ResponseEntity.ok(Map.of("message","Admin Updated Successfully"));
    }


    //DELETE ADMIN
    @DeleteMapping("/deleteadmin")
    public ResponseEntity<Map<String, String>> deleteAdmin(@RequestParam("adminId") int adminId, @RequestParam("password") String password){
        boolean result=adminService.deleteAdmin(adminId, password);
        if(!result)
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","Admin ID Not Found"));
        return ResponseEntity.ok(Map.of("message","Admin Deleted Successfully"));
    }


    //VIEW ADMIN
    @GetMapping("/alladmins")
    public ResponseEntity<List<Admin>> getAllAdmins(){
        List<Admin> allAdmins= adminService.getAllAdmins();
        return ResponseEntity.ok(allAdmins);
    }


    //GET ADMIN BY ID
    @GetMapping("/findadmin/{id}")
    public Admin getAdmin(@PathVariable("id") int id){
        return adminService.getAdmin(id);
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
        Packages p1 = packageService.addPackage(packages, admin);
        Map<String, String> response=new HashMap<>();
        response.put("message","Package Added Successfully");
        return ResponseEntity.ok(response);
    }


    //UPDATE PACKAGE BY PACKAGE AND ADMIN CREDENTIALS
    @PutMapping("/updatepackage")
    public ResponseEntity<?> updatePackage(@ModelAttribute Packages packages,@ModelAttribute Admin admin) {
        Packages p1 = packageService.updatePackage(packages, admin);
        return ResponseEntity.ok(Map.of("message", "Package Updated Successfully"));
    }

    //DELETE PACKAGE BY PACKAGE AND ADMIN CREDENTIALS
    @DeleteMapping("/deletepackage")
    public ResponseEntity<?> deletePackage(@ModelAttribute Packages packages, @ModelAttribute Admin admin){
        boolean deletePackage=packageService.deletePackage(packages,admin);
        return ResponseEntity.ok(Map.of("message","Package Deleted Successfully"));
    }

    //GET ALL PACKAGES
    @GetMapping("/allpackages")
    public ResponseEntity<List<Packages>> getAllPackages(){
        List<Packages> listPackages=packageService.getAllPackages();
        return ResponseEntity.ok(listPackages);
    }

    //GET PACKAGE BY ID
    @GetMapping("/getPackage/{package_id}")
    public ResponseEntity<?> getPackageById(@PathVariable Integer package_id){
        Packages pkg=packageService.getPackageById(package_id);
        return ResponseEntity.ok(pkg);
    }


                                                        //  --- TOUR ---
    //ADD TOUR
    @PostMapping("/addtour")
    public ResponseEntity<?> addTour(@RequestParam("packageName")int packageName, @ModelAttribute Tour tour, @RequestParam("adminId") int adminId,
                                     @RequestParam("password") String password){
        Tour addTour= tourService.addTour(packageName,tour,adminId, password);
        return ResponseEntity.ok(Map.of("message","Tour Added Successfully"));

    }

    // UPDATE TOUR
    @PutMapping("/updatetour")
    public ResponseEntity<?> updateTour(@RequestParam("packageName")int packageId, @ModelAttribute Tour tour, @RequestParam("adminId") int adminId,
                                        @RequestParam("password") String password){
        Tour addTour= tourService.updateTour(packageId,tour,adminId, password);
        return ResponseEntity.ok(Map.of("message","Tour Updated Successfully"));

    }

    // DELETE TOUR
    @DeleteMapping("/deletetour")
    public ResponseEntity<Map<String,String>> deleteTour(@RequestParam("packageName") int packageId, @RequestParam("tourId") int tourId, @RequestParam("adminId")int adminID,
                                                         @RequestParam("password") String password){

        boolean deleteTour=tourService.deleteTour(packageId, tourId,adminID,password);
        if(deleteTour)
            return ResponseEntity.ok(Map.of("message","Tour deleted Successfully"));
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","Package deletion Failed"));
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
        Tour tour=tourService.getTourByID(packageID,tourID);
        return ResponseEntity.ok(tour);
    }



}

package com.example.travellers_choice.controller;

import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;
import com.example.travellers_choice.service.AdminService;
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
@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
public class AdminController {


    @Autowired
    AdminService adminService;


    // ADMIN Controller
    //SIGN UP ADMIN
    @PostMapping("/adminsignup")
    public ResponseEntity<?> signUp(@ModelAttribute Admin admin){
        Admin saveAdmin=adminService.signUp(admin);
        return ResponseEntity.ok(saveAdmin);
    }

    //LOGIN ADMIN
    @PostMapping("/adminlogin")
    public ResponseEntity<?> adminLogin(@RequestParam("email") String email, @RequestParam("password") String password, HttpSession httpSession){

        Admin adminLogin=adminService.adminLogin(email,password);
        if(adminLogin!=null){
            httpSession.setAttribute("loggedAdmin",adminLogin);
            Map<String, Object> response=new HashMap<>();
            response.put("adminId",adminLogin.getAdminId());
            response.put("adminUserName",adminLogin.getUsername());
            response.put("message","Login Successful");
            return ResponseEntity.ok(response);
        }
        Map<String,Object> error=new HashMap<>();
        error.put("error","Invalid Credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }


    @GetMapping("/username")
    public ResponseEntity<?> getUsername(HttpSession session){
        Admin admin=(Admin)session.getAttribute("loggedAdmin");

        if(admin!=null){
            Map<String,Object> response= new HashMap<>();
            response.put("adminId",admin.getAdminId());
            response.put("adminUserName",admin.getUsername());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User Not Found");
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


    //delete admin
    @DeleteMapping("/deleteadmin")
    public ResponseEntity<Map<String, String>> deleteAdmin(@RequestParam("adminId") int adminId, @RequestParam("password") String password){
        boolean result=adminService.deleteAdmin(adminId, password);
        if(!result)
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","Admin ID Not Found"));
        return ResponseEntity.ok(Map.of("message","Admin Deleted Successfully"));
    }

    // UPDATE ADMIN
    @PostMapping("/updateadmin")
    public ResponseEntity<Map<String, String>> updateAdmin(@ModelAttribute Admin admin){
        adminService.updateAdmin(admin);
        return ResponseEntity.ok(Map.of("message","Admin Updated Successfully"));
    }


    // CUSTOMERS
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
}

package com.example.travellers_choice.service;


import com.example.travellers_choice.exception.AlreadyExistsException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.ApiResponse;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;

import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.repository.CustomerRegister;
import com.example.travellers_choice.repository.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Service
public class AdminService {

    @Autowired
    CustomerRegister customerRegisterRepo;

    @Autowired
    UserRepo userRepo;

    @Autowired
    AdminRepo adminRepo;



    //ADMIN SIGN UP
    public ResponseEntity<?> signUp(Admin admin) {
        if(adminRepo.existsByEmail(admin.getEmail())){
            throw new AlreadyExistsException("Email",admin.getEmail());
        }
        if(adminRepo.existsByContact(admin.getContact())){
            throw new AlreadyExistsException("Contact", admin.getContact());
        }
        adminRepo.save(admin);
         return  ResponseEntity.ok(new ApiResponse("Sign Up Successful","200",LocalDateTime.now()));
    }


    //ADMIN  LOGIN
    public ResponseEntity<?> adminLogin(String email, String password) {

        Admin admin=adminRepo.findByEmailAndPassword(email,password).
                orElseThrow(()-> new UnAuthorizedException("Email", email));

        Map<String, Object> response=new LinkedHashMap<>();
        response.put("Local Date & Time",LocalDateTime.now());
        response.put("message","Login Successful");
        response.put("adminId",admin.getAdminId());
        response.put("adminUserName",admin.getUsername());
        return ResponseEntity.ok(response);
    }

    //logout admin
    public ResponseEntity<?>logout(HttpServletRequest request){

        HttpSession session= request.getSession(false);
        if(session!=null){
            session.invalidate();
        }
        return ResponseEntity.ok(new ApiResponse("Logged Out Succesfully","200",LocalDateTime.now()));
    }

    public Admin getAdminByEmail(String email){
        return adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Email", email));
    }

    // DELETE ADMIN BY id and password
    public ResponseEntity<?> deleteAdmin(int id, String password) {
        Admin existingAdmin=adminRepo.findById(id).orElseThrow(()-> new IDNotFoundException("Admin ID", id));
        if(existingAdmin.getPassword().equals(password)){
            adminRepo.delete(existingAdmin);
            ApiResponse res= new ApiResponse("Deleted Successfully","200", LocalDateTime.now());
            return ResponseEntity.ok(res);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("Invalid Password","401",LocalDateTime.now()));
    }


    //UPDATE ADMIN
    public ResponseEntity<?> updateAdmin(Admin admin) {
        Admin exisitingAdmin=adminRepo.findById(admin.getAdminId())
                .orElseThrow(()-> new IDNotFoundException("Admin ID", admin.getAdminId()));

        if(exisitingAdmin.getPassword().equals(admin.getPassword())){
            if(admin.getUsername() !=null && !admin.getUsername().isBlank())
                exisitingAdmin.setUsername(admin.getUsername());
            if(admin.getEmail() !=null && !admin.getEmail().isBlank())
                exisitingAdmin.setEmail(admin.getEmail());
            if(admin.getContact() !=null && !admin.getContact().isBlank())
                exisitingAdmin.setContact(admin.getContact());
        }
        adminRepo.save(exisitingAdmin);
        return ResponseEntity.ok( new ApiResponse("Admin Updated Successfully","200",LocalDateTime.now()));
    }

    //VIEW ALL ADMINS
    public List<Admin> getAllAdmins() {
        return adminRepo.findAll();
    }

    //VIEW ADMIN BY ID
    public ResponseEntity<?> getAdmin(Integer adminId) {
        Admin admin= adminRepo.findById(adminId).orElseThrow(()-> new IDNotFoundException("Admin ID",adminId));
        Map<String,Object> response= new LinkedHashMap<>();
        response.put("Admin ID",admin.getAdminId());
        response.put("User Name",admin.getUsername());
        response.put("Email",admin.getEmail());
        response.put("Mobile",admin.getContact());
        return ResponseEntity.ok(response);
    }



    // CUSTOMERS
    public List<CustomerRegistry> getAllRegUsers() {
        return customerRegisterRepo.findAll();
    }

    public List<Customer> getAllCustomers() {
        return userRepo.findAll();
    }
}

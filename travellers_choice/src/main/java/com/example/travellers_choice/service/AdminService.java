package com.example.travellers_choice.service;


import com.example.travellers_choice.dto.AdminDTO;
import com.example.travellers_choice.exception.AlreadyExistsException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.ApiResponse;
import com.example.travellers_choice.dto.AResponse;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;

import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.repository.CustomerRegister;
import com.example.travellers_choice.repository.UserRepo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
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

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder passwordEncoder;

    //ADMIN SIGN UP
    public ResponseEntity<?> signUp(Admin admin) {
        if(adminRepo.existsByEmail(admin.getEmail())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AResponse(LocalDateTime.now(),
                            "Already Exists",
                            "Email ID " + admin.getEmail() + " already exists"));
        }
        if(adminRepo.existsByContact(admin.getContact())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AResponse(LocalDateTime.now(),
                            "Already Exists",
                            "Mobile Number " + admin.getContact() + " already exists"));
        }
        admin.setRole("ROLE_ADMIN");
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        adminRepo.save(admin);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Sign Up Successfully"));
    }


    //ADMIN  LOGIN
    public ResponseEntity<?> adminLogin(String email, String password, HttpSession session) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            session.setAttribute("SPRING_SECURITY_CONTEXT",SecurityContextHolder.getContext());

            Admin admin = adminRepo.findByEmail(email)
                    .orElseThrow(() -> new UnAuthorizedException("Email not found", email));
            session.setAttribute("LoggedAdmin",admin);
            return ResponseEntity.ok(new AResponse(
                    LocalDateTime.now(),
                    "Success",
                    "Login Successful"
            ));
        }
        catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AResponse(LocalDateTime.now(), "Failure", "Invalid Email or Password"));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AResponse(LocalDateTime.now(), "Failure", "Server error, try again"));
        }
    }


    //logout admin
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new ApiResponse("Logged Out Successfully", "200", LocalDateTime.now()));
    }


    //get admin by email
    public Admin getAdminByEmail(String email){
        return adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Email", email));
    }

    // DELETE ADMIN BY id and password
    public ResponseEntity<?> deleteAdmin(Integer id, String password) {
        Admin existingAdmin=adminRepo.findById(id).orElseThrow(()-> new IDNotFoundException("Admin ID", id));

        if(passwordEncoder.matches(password,existingAdmin.getPassword())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new AResponse(LocalDateTime.now(), "Failure", "Admin cannot delete by own"));
        }
        adminRepo.delete(existingAdmin);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Admin Deleted Successfully"));
    }




    //UPDATE ADMIN
    public ResponseEntity<?> updateAdmin(AdminDTO admin, String email) {
        Admin existingAdmin=adminRepo.findByEmail(email)
                .orElseThrow(()-> new UnAuthorizedException("Email ID", email));

        if(!passwordEncoder.matches(admin.getPassword(),existingAdmin.getPassword())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).
                    body(new AResponse(LocalDateTime.now(), "Failure", "Password do not matches"));
        }

        if (admin.getUsername() != null && !admin.getUsername().isBlank()) {
            existingAdmin.setUsername(admin.getUsername());
        }

        if (admin.getContact() != null && !admin.getContact().isBlank()) {
            existingAdmin.setContact(admin.getContact());
        }

        // Only update email if required
        if (admin.getEmail() != null && !admin.getEmail().isBlank()
                && !admin.getEmail().equals(existingAdmin.getEmail())) {
            existingAdmin.setEmail(admin.getEmail());
        }

        // Update password if provided
        if (admin.getNewPassword() != null && !admin.getNewPassword().isBlank()) {
            existingAdmin.setPassword(passwordEncoder.encode(admin.getNewPassword()));
        }
        adminRepo.save(existingAdmin);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Admin Updated Successfully"));
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


    public ResponseEntity<?> adminData(String email) {
        Admin admin=adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Admin Email",email));
        AdminDTO dto= new AdminDTO(admin);
        return ResponseEntity.ok(dto);
    }
}

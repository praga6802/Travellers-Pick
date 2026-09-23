package com.example.travellers_choice.service;


import com.example.travellers_choice.dto.AdminDTO;
import com.example.travellers_choice.dto.BookedUserDTO;
import com.example.travellers_choice.dto.UserRegisterDTO;
import com.example.travellers_choice.exception.AlreadyExistsException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.ApiResponse;
import com.example.travellers_choice.dto.AResponse;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;

import com.example.travellers_choice.repository.*;

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
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
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
    private PackageRepo packageRepo;

    @Autowired
    private TourRepo tourRepo;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder passwordEncoder;

    //ADMIN SIGN UP
    public ResponseEntity<?> signUp(UserRegisterDTO user) {
        if(adminRepo.existsByEmail(user.getEmail())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AResponse(LocalDateTime.now(),
                            "Already Exists",
                            "Email ID " + user.getEmail() + " already exists"));
        }
        if(adminRepo.existsByContact(user.getContact())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AResponse(LocalDateTime.now(),
                            "Already Exists",
                            "Mobile Number " + user.getContact() + " already exists"));
        }

        Admin admin = new Admin();
        admin.setUsername(user.getUsername());
        admin.setEmail(user.getEmail());
        admin.setPassword(passwordEncoder.encode(user.getPassword()));
        admin.setContact(user.getContact());
        admin.setRole("ROLE_ADMIN");
        adminRepo.save(admin);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Sign Up Successfully"));
    }


    //ADMIN  LOGIN
    public ResponseEntity<?> adminLogin(String email, String password, HttpSession session) {
        Admin admin=adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Admin Email",email));
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,SecurityContextHolder.getContext());
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

    //get current admin
    public ResponseEntity<?> getCurrentAdmin(UserDetails userDetails) {
        if(userDetails==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AResponse(LocalDateTime.now(),"Failure","Session Expired..Please try again!"));
        }
        String email=userDetails.getUsername();
        Admin admin=adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Admin Email",email));

        Map<String,Object> response=new HashMap<>();
        response.put("adminId",admin.getAdminId());
        response.put("username",admin.getUsername());
        response.put("email",admin.getEmail());
        response.put("contact",admin.getContact());
        return ResponseEntity.ok(response);
    }

    //logout admin
    public ResponseEntity<?> logout(UserDetails userDetails, HttpSession session) {
        if(userDetails==null) {
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AResponse(LocalDateTime.now(),"Failure","Session expired..Please try again!"));
        }
        session.invalidate();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Logout Successfully"));
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
    public List<BookedUserDTO> getAllRegUsers() {
        return customerRegisterRepo.findAll().stream()
                //Integer userId, String userName, String email, String phone, Double price, String packageName, String tourName,
                //                         String tdate, String bdate, String noOfSeats, String noOfAdults, String noOfChildren, String city,
                //                         String state, String country, String status
                .map(user->new BookedUserDTO(user.getUser().getId(),user.getName(),user.getEmail(),user.getPhone(),user.getPrice(),user.getPackageName(),user.getTour().getTourName(),
                        user.getTdate(),user.getBdate(),user.getNoOfSeats(),user.getNoOfAdults(),user.getNoOfChildren(),user.getCity(),user.getState(),user.getCountry(),user.getStatus())).toList();

    }

    public List<Customer> getAllCustomers() {
        return userRepo.findAll();
    }


    public ResponseEntity<?> adminData(String email) {
        Admin admin=adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Admin Email",email));
        AdminDTO dto= new AdminDTO(admin);
        return ResponseEntity.ok(dto);
    }

    // admin count
    public ResponseEntity<AResponse> getAdmins(String username) {
        Admin admin = adminRepo.findByEmail(username).orElseThrow(()-> new UnAuthorizedException("Admin not found",username));

        Long adminCount = adminRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",adminCount));
    }

    // user count
    public ResponseEntity<AResponse> getUsers(String username) {
        Admin admin = adminRepo.findByEmail(username).orElseThrow(()-> new UnAuthorizedException("Admin not found",username));

        Long userCount = userRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",userCount));
    }

    // package count
    public ResponseEntity<AResponse> getPackages(String username) {
        Admin admin = adminRepo.findByEmail(username).orElseThrow(()-> new UnAuthorizedException("Admin not found",username));

        Long packageCount = packageRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",packageCount));
    }

    // tour count
    public ResponseEntity<AResponse> getTours(String username) {
        Admin admin = adminRepo.findByEmail(username).orElseThrow(()-> new UnAuthorizedException("Admin not found",username));

        Long tourCount = tourRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",tourCount));
    }

    // bookings count
    public ResponseEntity<AResponse> getBookings(String username) {
        Admin admin = adminRepo.findByEmail(username).orElseThrow(()-> new UnAuthorizedException("Admin not found",username));

        Long bookingCount = customerRegisterRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",bookingCount));
    }

    // count confirmed customer
    public ResponseEntity<AResponse> getConfirmed(String username) {
        Admin admin = adminRepo.findByEmail(username).orElseThrow(()-> new UnAuthorizedException("Admin not found",username));

        Long confirmedCount = customerRegisterRepo.countByStatus("CONFIRMED");
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",confirmedCount));
    }

    // count cancelled customer
    public ResponseEntity<AResponse> getCancelled(String username) {
        Admin admin = adminRepo.findByEmail(username).orElseThrow(()-> new UnAuthorizedException("Admin not found",username));

        Long cancelledCount = customerRegisterRepo.countByStatus("CANCELLED");
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",cancelledCount));
    }
}

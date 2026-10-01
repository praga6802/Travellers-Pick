package com.example.travellers_choice.service;


import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.exception.*;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.BookingRegistry;
import com.example.travellers_choice.repository.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
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
    public ResponseEntity<AResponse> signUp(UserRegisterDTO user) {
        if(adminRepo.existsByEmail(user.getEmail())){
            throw new AlreadyExistsException("Email",user.getEmail());
        }
        if(adminRepo.existsByContact(user.getContact())){
            throw new AlreadyExistsException("Mobile Number", user.getContact());
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
    public ResponseEntity<AResponse> adminLogin(String email, String password, HttpSession session) {
        Authentication auth=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email,password));
        SecurityContextHolder.getContext().setAuthentication(auth);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,SecurityContextHolder.getContext());
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Login Successful"));
    }

    //get current admin
    public ResponseEntity<AResponse> getCurrentAdmin(UserDetails userDetails) {
        if(userDetails==null){
            throw new UnAuthorizedException("Session Expired.. Please try again!");
        }

        String email=userDetails.getUsername();
        Admin admin=adminRepo.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("Email ID"+" "+email));

        UserDetailsDTO currentAdmin = new UserDetailsDTO(admin.getAdminId(),admin.getUsername(),admin.getEmail(),admin.getContact(),admin.getRole());
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",currentAdmin));
    }

    //logout admin
    public ResponseEntity<AResponse> logout(HttpSession session) {
        if(session!=null){
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Logout Successfully"));
    }


    //UPDATE ADMIN
    public ResponseEntity<AResponse> updateAdmin(AdminDTO admin, String email) {
        Admin existingAdmin=adminRepo.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("Email ID"+" "+email));

        if(admin.getPassword()==null){
            throw new BusinessException("Password cannot be empty!");
        }

        if(!passwordEncoder.matches(admin.getPassword(),existingAdmin.getPassword())) {
           throw new BusinessException("Password do not matches");
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


    // DELETE ADMIN BY id and password
    public ResponseEntity<AResponse> deleteAdmin(Integer id, String password, String email) {
        Admin targetAdmin = adminRepo.findById(id).orElseThrow(()-> new IDNotFoundException("Admin ID",id));
        Admin currentAdmin=adminRepo.findByEmail(email).orElseThrow(()-> new IDNotFoundException("Admin ID", id));

        if(currentAdmin.getAdminId()==(targetAdmin.getAdminId())){
            throw new BusinessException("You cannot delete your own account!");
        }

        if(!passwordEncoder.matches(password,currentAdmin.getPassword())) {
            throw new BusinessException("Password does not match!");
        }

        adminRepo.delete(targetAdmin);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Admin Deleted Successfully"));
    }

    //VIEW ADMIN BY ID
    public ResponseEntity<AResponse> getAdmin(Integer adminId) {
        Admin admin= adminRepo.findById(adminId).orElseThrow(()-> new IDNotFoundException("Admin ID",adminId));

        UserDetailsDTO ad = new UserDetailsDTO(admin.getAdminId(),admin.getUsername(),admin.getEmail(),admin.getContact(),admin.getRole());
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",ad));
    }


    //VIEW ALL ADMINS
    public ResponseEntity<AResponse> getAllAdmins() {
        List<Admin> admins = adminRepo.findAll();
        if(admins.isEmpty()){
            throw new ResourceNotFoundException("Admins");
        }
        List<UserDetailsDTO> adminList = admins.stream()
                .map(admin->new UserDetailsDTO(admin.getAdminId(),admin.getUsername(),admin.getEmail(),admin.getContact(),admin.getRole())).toList();

        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",adminList));
    }


    // view all booked users
    public ResponseEntity<AResponse> getAllRegUsers() {
        List<BookingRegistry> customerRegistryList = customerRegisterRepo.findAll();
        if(customerRegistryList.isEmpty()){
            throw new ResourceNotFoundException("Users");
        }
        List<BookedUserDTO> bookedUserDTOList = customerRegistryList.stream()
                .map(user->new BookedUserDTO(user.getUser().getId(),user.getName(),user.getEmail(),user.getPhone(),user.getPrice(),user.getPackageName(),user.getTour().getTourName(),
                user.getTdate(),user.getBdate(),user.getNoOfSeats(),user.getNoOfAdults(),user.getNoOfChildren(),user.getCity(),user.getState(),user.getCountry(),user.getStatus())).toList();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",bookedUserDTOList));

    }

    // get all users list
    public ResponseEntity<AResponse> getAllCustomers() {
        List<Customer> customers = userRepo.findAll();
        if(customers.isEmpty()){
            throw new ResourceNotFoundException("Customers");
        }
        List<UserDetailsDTO> userList = customers.stream().map(user-> new UserDetailsDTO(user.getId(),user.getUsername(),user.getEmail(),user.getContact(),user.getRole()))
                .toList();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",userList));
    }



    // ADMIN DASHBOARD
    // admin count
    public ResponseEntity<AResponse> getAdminsCount() {
        Long adminCount = adminRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",adminCount));
    }

    // user count
    public ResponseEntity<AResponse> getUsersCount() {
        Long userCount = userRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",userCount));
    }

    // package count
    public ResponseEntity<AResponse> getPackagesCount() {
        Long packageCount = packageRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",packageCount));
    }

    // tour count
    public ResponseEntity<AResponse> getToursCount() {
        Long tourCount = tourRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",tourCount));
    }

    // bookings count
    public ResponseEntity<AResponse> getBookingsCount() {
        Long bookingCount = customerRegisterRepo.count();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",bookingCount));
    }

    // count confirmed customer
    public ResponseEntity<AResponse> getConfirmedCount() {
        Long confirmedCount = customerRegisterRepo.countByStatus("CONFIRMED");
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",confirmedCount));
    }

    // count cancelled customer
    public ResponseEntity<AResponse> getCancelledCount() {
        Long cancelledCount = customerRegisterRepo.countByStatus("CANCELLED");
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",cancelledCount));
    }
}

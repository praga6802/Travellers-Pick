package com.example.travellers_choice.controller;

import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.model.Tour;
import com.example.travellers_choice.service.IternaryService;
import com.example.travellers_choice.service.PackageService;
import com.example.travellers_choice.service.TourService;
import com.example.travellers_choice.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    PackageService packageService;

    @Autowired
    TourService tourService;

    @Autowired
    IternaryService iternaryService;


    //user signup
    @PostMapping("/signup")
    public ResponseEntity<?> userSignUp(@RequestBody UserRegisterDTO user) {
        return userService.userSignUp(user);
    }

    //user login
    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody LoginDTO user, HttpSession session) {
        return userService.userLogin(user, session);
    }

    //get the current user
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.getCurrentUser(userDetails);
    }

    //logout user
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails, HttpSession session) {
        return userService.logout(userDetails, session);
    }

    //update user
    @PatchMapping("/updateUser")
    public ResponseEntity<?> updateUser(@RequestBody UserDTO user,@AuthenticationPrincipal UserDetails userDetails){
        if(userDetails == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AResponse(LocalDateTime.now(), "Failure", "Session Expired! Please login again"));
        }
        return userService.updateUser(user,userDetails.getUsername());
    }

    // book tour
    @PostMapping("/{packageName}/book")
    public ResponseEntity<?> bookCategory(@RequestBody BookTourDTO bookTourDTO, @PathVariable String packageName, @AuthenticationPrincipal UserDetails userDetails) {
        bookTourDTO.setPackageName(packageName);
        System.out.println("userDetails = " + userDetails);
        System.out.println("username = " + userDetails.getUsername());
        System.out.println("packageName = " + packageName);
        System.out.println("DTO = " + bookTourDTO);

        System.out.println("BEFORE SERVICE");
        System.out.println("booking form...");
        System.out.println("Saved email: "+userDetails.getUsername());
        return userService.bookCategory(bookTourDTO, userDetails.getUsername());
    }
    
    //get all tour bookings
    @GetMapping("/bookedTours")
    public ResponseEntity<?> getAllBookedTours(@AuthenticationPrincipal UserDetails userDetails){
        if(userDetails == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AResponse(LocalDateTime.now(), "Failure", "Session Expired! Please login again"));
        }
        return userService.getAllBookedTours(userDetails.getUsername());
    }

    //cancel tour
    @DeleteMapping("/cancelTour")
    public ResponseEntity<?> cancelTour(@RequestBody CancelTourDTO cancelTourDTO, @AuthenticationPrincipal UserDetails userDetails){
        if(userDetails == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AResponse(LocalDateTime.now(), "Failure", "Session Expired! Please login again"));
        }
        return userService.cancelTour(cancelTourDTO.getPnr(),userDetails.getUsername());
    }

    //get the user data
    @GetMapping("/userData")
    public ResponseEntity<?> userData(@AuthenticationPrincipal UserDetails userDetails){
        if(userDetails == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AResponse(LocalDateTime.now(), "Failure", "Session Expired! Please login again"));
        }
        return userService.userData(userDetails.getUsername());
    }

    @GetMapping("/allIternaries")
    public ResponseEntity<List<SendIternaryDTO>> allIternaries(){
        List<SendIternaryDTO> iternaryList= iternaryService.allIternaries();
        return ResponseEntity.ok(iternaryList);
    }

    @PostMapping("/verifyOTP")
    public ResponseEntity<?> verifyOTP(@RequestBody RequestOTPDTO otp,@AuthenticationPrincipal UserDetails userDetails) throws JsonProcessingException {
        if(otp.getOtp()==null || otp.getOtp().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AResponse(LocalDateTime.now(),"Failure","OTP is required! Before Updating the Email!"));
        }
        return userService.verifyOTP(userDetails.getUsername(),otp.getOtp());
    }
}


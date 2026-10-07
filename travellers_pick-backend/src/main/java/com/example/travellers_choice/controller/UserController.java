package com.example.travellers_choice.controller;

import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.service.ItineraryService;
import com.example.travellers_choice.service.PackageService;
import com.example.travellers_choice.service.TourService;
import com.example.travellers_choice.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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
    ItineraryService iternaryService;


    //user signup
    @PostMapping("/signup")
    public ResponseEntity<AResponse> userSignUp(@RequestBody UserRegisterDTO user) {
        return userService.userSignUp(user);
    }

    //user login
    @PostMapping("/login")
    public ResponseEntity<AResponse> userLogin(@RequestBody LoginDTO user, HttpSession session) {
        return userService.userLogin(user, session);
    }

    //get the current user
    @GetMapping("/current-user")
    public ResponseEntity<AResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.getCurrentUser(userDetails);
    }

    //logout user
    @PostMapping("/logout")
    public ResponseEntity<AResponse> logout(HttpSession session) {
        return userService.logout(session);
    }

    //update user
//    @PatchMapping("/update")
//    public ResponseEntity<AResponse> updateUser(@RequestBody UserDTO userDTO, @AuthenticationPrincipal UserDetails userDetails){
//        return userService.updateUser(userDTO, userDetails.getUsername());
//    }

    // book tour
    @PostMapping("/book")
    public ResponseEntity<AResponse> bookTour(@RequestBody BookTourDTO bookTourDTO) {
        return userService.bookTour(bookTourDTO);
    }


    //get all tour bookings
    @GetMapping("/bookings")
    public ResponseEntity<AResponse> getAllBookings(@AuthenticationPrincipal UserDetails userDetails){
        return userService.getAllBookings(userDetails.getUsername());
    }

    //cancel tour
//    @DeleteMapping("/bookings/cancel")
//    public ResponseEntity<AResponse> cancelBooking(@RequestBody CancelTourDTO cancelTourDTO, @AuthenticationPrincipal UserDetails userDetails){
//        return userService.cancelBooking(cancelTourDTO.getPnr(),userDetails.getUsername());
//    }


    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestBody RequestOTPDTO otp,@AuthenticationPrincipal UserDetails userDetails) throws JsonProcessingException {
        if(otp.getOtp()==null || otp.getOtp().isBlank()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AResponse(LocalDateTime.now(),"Failure","OTP is required! Before Updating the Email!"));
        }
        return userService.verifyOTP(userDetails.getUsername(),otp.getOtp());
    }

    // get tour details for tour booking form
    @GetMapping("/tour/{tourId}")
    public ResponseEntity<?> getTour(@PathVariable Integer tourId) {
        return userService.getTour(tourId);
    }

    //booking form up
    @GetMapping("/itineraries/{tourId}")
    public ResponseEntity<AResponse> getItinerariesByTourId(@PathVariable Integer tourId){
        return iternaryService.getItinerariesByTourId(tourId);
    }
}


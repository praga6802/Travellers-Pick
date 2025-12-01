package com.example.travellers_choice.controller;

import com.example.travellers_choice.dto.BookTourDTO;
import com.example.travellers_choice.dto.LoginDTO;
import com.example.travellers_choice.dto.UserDTO;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.model.Tour;
import com.example.travellers_choice.service.PackageService;
import com.example.travellers_choice.service.TourService;
import com.example.travellers_choice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

    //user signup
    @PostMapping("/signup")
    public ResponseEntity<?> customerSignUp(@RequestBody Customer customer){
        return userService.customerSignUp(customer);
    }

    //user login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginData, HttpSession session){
        System.out.println(loginData.getEmail()+" "+loginData.getPassword());
       return userService.customerLogin(loginData.getEmail(),loginData.getPassword(),session);
    }

    //get the current user
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(HttpSession session){
     return userService.getCurrentUser(session);
    }


    //logout user
    @PostMapping("/logout")
    public  ResponseEntity<?> logout(HttpSession session){
        return userService.logout(session);
    }


    // -- BOOK TOUR PACKAGE
    @PostMapping("/{packageName}/book")
    public ResponseEntity<?> bookCategory(@RequestBody BookTourDTO bookTourDTO,@PathVariable String packageName, @AuthenticationPrincipal UserDetails userDetails){
        System.out.println("Logged in user: " + SecurityContextHolder.getContext().getAuthentication());
        bookTourDTO.setPackageName(packageName);
        return userService.bookCategory(bookTourDTO,userDetails.getUsername());
    }

//    @GetMapping("/getBookings/{userId}")
//    public List<UserDTO> viewMyBookings(@PathVariable Integer userId){
//        return userService.getMyBookings(userId);
//    }

//    // -- VIEW PACKAGES
//    @GetMapping("/packages")
//    public List<Packages> getAllPackages(){
//        return packageService.getAllPackages();
//    }
//
//
//    // -- VIEW ALL TOURS
//    @GetMapping("/tours")
//    public List<Tour> getAllTours(){
//        return tourService.getAllTours();
//    }
}

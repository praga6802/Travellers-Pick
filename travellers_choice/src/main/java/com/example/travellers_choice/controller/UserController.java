package com.example.travellers_choice.controller;

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
    public ResponseEntity<?> login(@RequestBody Customer customerLogin, HttpSession session){

        String email=customerLogin.getEmail();
        String password=customerLogin.getPassword();
        ResponseEntity response=userService.customerLogin(email,password);
        Customer user=userService.findUserByEmail(email);
        session.setAttribute("LoggedUser",user);
        return response;
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getUserName(HttpSession session){
        Customer user=(Customer)session.getAttribute("LoggedUser");

        if(user!=null){
            Map<String,Object> response= new HashMap<>();

            response.put("UserId",user.getId());
            response.put("Active User",user.getUsername());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Inactive session"));
    }


    //logout user
    @PostMapping("/logout")
    public  ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response){
        return userService.logout(request);
    }


    // -- BOOK TOUR PACKAGE
    @PostMapping("/{package_name}/book")
    public ResponseEntity<String> booktour(@PathVariable String package_name, @ModelAttribute CustomerRegistry customerRegistry, HttpSession session){

        Integer userId=(Integer)session.getAttribute("userId");
        CustomerRegistry customerRegister=userService.bookTour(customerRegistry,package_name, userId);
        String response="Successfully Booked "+customerRegister.getRegion()+" for "+customerRegister.getUser().getUsername();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getBookings/{userId}")
    public List<UserDTO> viewMyBookings(@PathVariable Integer userId){
        return userService.getMyBookings(userId);
    }

    // -- VIEW PACKAGES
    @GetMapping("/packages")
    public List<Packages> getAllPackages(){
        return packageService.getAllPackages();
    }


    // -- VIEW ALL TOURS
    @GetMapping("/tours")
    public List<Tour> getAllTours(){
        return tourService.getAllTours();
    }
}

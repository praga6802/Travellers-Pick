package com.example.travellers_choice.controller;

import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;
import com.example.travellers_choice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class UserController {

    @Autowired
    UserService userService;

    //user signup
    @PostMapping("/usersignup")
    public ResponseEntity<?> customerSignUp(@ModelAttribute Customer customer){
        Customer customer1= userService.customerSignUp(customer);
        return ResponseEntity.ok(customer1);
    }


    //user login
    @PostMapping("/userlogin")
    public ResponseEntity<Map<String,String>> login(@ModelAttribute Customer customer){

        boolean result=userService.customerLogin(customer);
        if(result==true){
            return ResponseEntity.ok(Map.of("message","Login Successful"));
        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Invalid User Name or Password"));
        }


    }

    //booking tourPackage
    @PostMapping("/{package_name}/book")
    public ResponseEntity<String> booktour(@PathVariable("package_name") String package_name,@ModelAttribute CustomerRegistry customerRegistry){
        CustomerRegistry customerRegister=userService.bookTour(customerRegistry,package_name);
        String response="Successfully booked "+customerRegistry.getRegion();
        return ResponseEntity.ok(response);

    }



}

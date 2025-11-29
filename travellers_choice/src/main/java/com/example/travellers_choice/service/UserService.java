package com.example.travellers_choice.service;

import com.example.travellers_choice.dto.AResponse;
import com.example.travellers_choice.dto.UserDTO;
import com.example.travellers_choice.exception.AlreadyExistsException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.ApiResponse;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;
import com.example.travellers_choice.repository.CustomerRegister;
import com.example.travellers_choice.repository.UserRepo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    CustomerRegister registerRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;


    public CustomerRegistry bookTour(CustomerRegistry customerRegistry, String packageName, Integer userId) {

        Customer user=userRepo.findById(userId).orElseThrow(()->new IDNotFoundException("User ID",userId));
        customerRegistry.setUser(user);
        customerRegistry.setPackage_name(packageName);
        return registerRepo.save(customerRegistry);
    }


    //user sign up
    public ResponseEntity<?> customerSignUp(Customer customer) {

        if(userRepo.existsByContact(customer.getContact())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AlreadyExistsException("Mobile Number", customer.getContact()));
        }
        if(userRepo.existsByEmail(customer.getEmail())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AlreadyExistsException("Email ID", customer.getEmail()));
        }
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        userRepo.save(customer);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Sign Up Successfully"));
    }

    public ResponseEntity<?> customerLogin(String email, String password, HttpSession session) {
        try {
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            SecurityContextHolder.getContext().setAuthentication(auth);
            Customer customer = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Invalid Credentials", email));
            session.setAttribute("LoggedUser", customer);
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("userId", customer.getId());
            response.put("username", customer.getUsername());

            return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success", "Login Successful"));
        }
        catch (BadCredentialsException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).
                    body(new AResponse(LocalDateTime.now(),"Failure","Invalid Email or Password"));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).
                    body(new AResponse(LocalDateTime.now(),"Failure","Something went wrong"));
        }
    }

    public ResponseEntity<?> logout(HttpSession session){
        session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Logout Successfully"));
    }


    public Customer findUserByEmail(String email){
        return userRepo.findUserByEmail(email).orElseThrow(()-> new UnAuthorizedException("Invalid Email",email));
    }

    //get bookings by User ID
    public List<UserDTO> getMyBookings(Integer userID){
        Customer userId= userRepo.findById(userID).orElseThrow(()->new IDNotFoundException("User ID",userID));

        List<CustomerRegistry> bookings=registerRepo.findByUserId(userID);
        return bookings.stream().
                map(user-> new UserDTO(user.getPackage_name(),user.getRegion(),user.getTdate(), user.getNum_seats())).
                collect(Collectors.toList());
    }

    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Customer user=(Customer)session.getAttribute("LoggedUser");
        if(user!=null){
            Map<String,Object> response= new HashMap<>();
            response.put("UserId",user.getId());
            response.put("Active User",user.getUsername());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Inactive session"));
    }
}

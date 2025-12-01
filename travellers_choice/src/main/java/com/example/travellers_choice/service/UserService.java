package com.example.travellers_choice.service;

import com.example.travellers_choice.dto.AResponse;
import com.example.travellers_choice.dto.BookTourDTO;
import com.example.travellers_choice.dto.UserDTO;
import com.example.travellers_choice.exception.AlreadyExistsException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
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
        customer.setRole("ROLE_USER");
        userRepo.save(customer);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Sign Up Successfully"));
    }

    public ResponseEntity<?> customerLogin(String email, String password, HttpSession session) {
        try {
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            SecurityContextHolder.getContext().setAuthentication(auth);
            session.setAttribute("SPRING_SECURITY_CONTEXT",SecurityContextHolder.getContext());

            Customer customer = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Invalid Credentials", email));
            session.setAttribute("LoggedUser", customer);
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

    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Customer user=(Customer) session.getAttribute("LoggedUser");
        if(user==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AResponse(LocalDateTime.now(),"Failure","No Active Session user"));
        }
        return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "userName", user.getUsername()
        ));
    }

    public ResponseEntity<?> logout(HttpSession session){
        session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Logout Successfully"));
    }


    public Customer findUserByEmail(String email){
        return userRepo.findUserByEmail(email).orElseThrow(()-> new UnAuthorizedException("Invalid Email",email));
    }

//    //get bookings by User ID
//    public List<UserDTO> getMyBookings(Integer userID){
//        Customer userId= userRepo.findById(userID).orElseThrow(()->new IDNotFoundException("User ID",userID));
//
//        List<CustomerRegistry> bookings=registerRepo.findByUserId(userID);
//        return bookings.stream().
//                map(user-> new UserDTO(user.getPackage_name(),user.getRegion(),user.getTdate(), user.getNum_seats())).
//                collect(Collectors.toList());
//    }


    public ResponseEntity<?> bookCategory(BookTourDTO bookTourDTO, String email) {
        Customer user=userRepo.findByEmail(email).orElseThrow(()->new UnAuthorizedException("Email ID",email));
        Customer loggedUser = userRepo.findById(bookTourDTO.getUserId())
                .orElseThrow(() -> new IDNotFoundException("User ID",bookTourDTO.getUserId()));

        CustomerRegistry book=new CustomerRegistry();
        book.setUser(loggedUser);
        book.setName(bookTourDTO.getName()!=null?bookTourDTO.getName():"No Name");
        book.setEmail(bookTourDTO.getEmail()!=null?bookTourDTO.getEmail():"No Email");
        book.setPhone(bookTourDTO.getPhone()!=null?bookTourDTO.getPhone():"No Mobile Number");
        book.setPackageName(bookTourDTO.getPackageName()!=null?bookTourDTO.getPackageName():"No Package Name");
        book.setRegion(bookTourDTO.getRegion()!=null?bookTourDTO.getRegion():"No Region");
        book.setBdate(bookTourDTO.getBdate()!=null?bookTourDTO.getBdate():"No date");
        book.setTdate(bookTourDTO.getTdate()!=null?bookTourDTO.getTdate():"No date");
        book.setNoOfSeats(bookTourDTO.getNoOfSeats()!=null?bookTourDTO.getNoOfSeats():0);
        book.setNoOfAdults(bookTourDTO.getNoOfAdults()!=null?bookTourDTO.getNoOfAdults():0);
        book.setNoOfChildren(bookTourDTO.getNoOfChildren()!=null?bookTourDTO.getNoOfChildren():0);
        book.setCity(bookTourDTO.getCity()!=null?bookTourDTO.getCity():"No city");
        book.setState(bookTourDTO.getState()!=null?bookTourDTO.getState():"No state");
        book.setCountry(bookTourDTO.getCountry()!=null?bookTourDTO.getCountry():"No country");

        registerRepo.save(book);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Tour Booked Successfully"));
    }
}

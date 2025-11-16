package com.example.travellers_choice.service;

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
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    CustomerRegister registerRepo;



    public CustomerRegistry bookTour(CustomerRegistry customerRegistry, String packageName, Integer userId) {

        Customer user=userRepo.findById(userId).orElseThrow(()->new IDNotFoundException("User ID",userId));

        customerRegistry.setUser(user);
        customerRegistry.setPackage_name(packageName);
        return registerRepo.save(customerRegistry);
    }


    //user sign up
    public ResponseEntity<?> customerSignUp(Customer customer) {

        if(userRepo.existsByContact(customer.getContact())){
            throw new AlreadyExistsException("Mobile Number",customer.getContact());
        }
        if(userRepo.existsByEmail(customer.getEmail())){
            throw new AlreadyExistsException("Email",customer.getEmail());
        }
        userRepo.save(customer);
        return ResponseEntity.ok(new ApiResponse("SignUp Successfully","200", LocalDateTime.now()));
    }

    public ResponseEntity<?> customerLogin(String email, String password) {

        Customer customer = userRepo.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new UnAuthorizedException("Invalid Credentials", email));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("userId", customer.getId());
        response.put("username", customer.getUsername());

        return ResponseEntity.ok(new ApiResponse("Login Successfully", "200", LocalDateTime.now(), response));
    }



    public ResponseEntity<?> logout(HttpServletRequest request){
        HttpSession session=request.getSession(false);
        if(session!=null){
            session.invalidate();
        }
        return ResponseEntity.ok(new ApiResponse("Logged Out Successfully","200",LocalDateTime.now()));
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
}

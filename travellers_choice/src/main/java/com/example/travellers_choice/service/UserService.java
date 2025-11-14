package com.example.travellers_choice.service;

import com.example.travellers_choice.dto.UserDTO;
import com.example.travellers_choice.exception.AlreadyExistsException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;
import com.example.travellers_choice.repository.CustomerRegister;
import com.example.travellers_choice.repository.UserRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    CustomerRegister registerRepo;



    public CustomerRegistry bookTour(CustomerRegistry customerRegistry, String packageName, Integer userId) {

        Customer user=userRepo.findById(userId).orElseThrow(()->new IDNotFoundException("User ID"+userId));

        customerRegistry.setUser(user);
        customerRegistry.setPackage_name(packageName);
        return registerRepo.save(customerRegistry);
    }


    //user sign up
    public Customer customerSignUp(Customer customer) {


        if(userRepo.existsByContact(customer.getContact())){
            throw new AlreadyExistsException("Mobile Number",customer.getContact());
        }
        if(userRepo.existsByEmail(customer.getEmail())){
            throw new AlreadyExistsException("Email",customer.getEmail());
        }
        return userRepo.save(customer);
    }

    public Customer customerLogin(String email, String password) {

        Optional<Customer> exisitingCustomer=userRepo.findByEmailAndPassword(email, password);
        return exisitingCustomer.orElse(null);
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

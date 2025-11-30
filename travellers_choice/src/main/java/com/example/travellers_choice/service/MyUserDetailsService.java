package com.example.travellers_choice.service;

import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    AdminRepo adminRepo;

    @Autowired
    UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Optional<Admin> adminOpt = adminRepo.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return User.builder().username(admin.getEmail()).password(admin.getPassword()).roles("ADMIN").build();
        }

        Optional<Customer> customerOptional = userRepo.findByEmail(email);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            return User.builder()
                    .username(customer.getEmail())
                    .password(customer.getPassword())
                    .roles("USER")
                    .build();
        }
        throw new UsernameNotFoundException("User not found with email" + email);
    }
}


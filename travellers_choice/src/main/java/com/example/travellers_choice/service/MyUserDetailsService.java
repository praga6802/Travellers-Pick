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

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    AdminRepo adminRepo;

    @Autowired
    UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        //check admin
        Admin admin = adminRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Email", email));
        if (admin != null) {
            return User.builder().username(admin.getEmail()).password(admin.getPassword()).roles("ADMIN").build();
        }

        //customer
        Customer customer = userRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return User.builder()
                .username(customer.getEmail())
                .password(customer.getPassword())
                .roles("USER")
                .build();
    }
}


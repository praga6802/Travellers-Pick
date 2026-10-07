package com.example.travellers_choice.controller;

import com.example.travellers_choice.service.EmailService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailTestController {

    private EmailService emailService;

    public EmailTestController(EmailService emailService){
        this.emailService=emailService;
    }

    @GetMapping("/email")
    public String sentEmail(){
        emailService.sendWelcomeEmail("delivered@resend.dev","Pragadeeswaran");
        return "email sent";
    }
}

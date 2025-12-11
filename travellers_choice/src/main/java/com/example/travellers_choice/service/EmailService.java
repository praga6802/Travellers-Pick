package com.example.travellers_choice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    JavaMailSender javaMailSender;

    public void sendSimpleEMail(String to, String subject, String message){
        SimpleMailMessage smm=new SimpleMailMessage();
        smm.setTo(to);
        smm.setSubject(subject);
        smm.setText(message);

        smm.setFrom("picktravellers@gmail.com");

        javaMailSender.send(smm);
    }
}

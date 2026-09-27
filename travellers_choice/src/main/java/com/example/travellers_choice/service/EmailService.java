package com.example.travellers_choice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    JavaMailSender javaMailSender;

    public void sendSimpleEMail(String to, String subject, String message) {

        try {
            System.out.println("Starting email...");
            System.out.println("To: " + to);

            SimpleMailMessage smm = new SimpleMailMessage();
            smm.setTo(to);
            smm.setSubject(subject);
            smm.setText(message);
            smm.setFrom("picktravellers@gmail.com");

            System.out.println("Before javaMailSender.send()");

            javaMailSender.send(smm);

            System.out.println("Email sent successfully!");

        } catch (Exception e) {
            System.out.println("Mail sending failed!");
            e.printStackTrace();
        }
    }
}

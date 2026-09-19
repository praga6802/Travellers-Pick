package com.example.travellers_choice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Travellers-Pick Backend is Successfully Live and Running!";
    }
}

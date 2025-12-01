package com.example.travellers_choice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class BookTourDTO {
    private Integer userId;
    private String name;
    private String email;
    private String phone;
    private String packageName;
    private String region;
    private String bdate;
    private String tdate;
    private Integer noOfSeats;
    private Integer noOfAdults;
    private Integer noOfChildren;
    private String city;
    private String state;
    private String country;
}

package com.example.travellers_choice.dto;

import lombok.Data;

@Data
public class BookedUserDTO {

    private Integer userId;
    private String userName;
    private String email;
    private String phone;
    private Double price;
    private String packageName;
    private String tourName;
    private String tdate;
    private String bdate;
    private Integer noOfSeats;
    private Integer noOfAdults;
    private Integer noOfChildren;
    private String city;
    private String state;
    private String country;
    private String status;


    public BookedUserDTO(Integer userId, String userName, String email, String phone, Double price, String packageName, String tourName,
                         String tdate, String bdate, Integer noOfSeats, Integer noOfAdults, Integer noOfChildren, String city,
                         String state, String country, String status) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.phone = phone;
        this.price = price;
        this.packageName = packageName;
        this.tourName = tourName;
        this.tdate = tdate;
        this.bdate = bdate;
        this.noOfSeats = noOfSeats;
        this.noOfAdults = noOfAdults;
        this.noOfChildren = noOfChildren;
        this.city = city;
        this.state = state;
        this.country = country;
        this.status = status;
    }


}

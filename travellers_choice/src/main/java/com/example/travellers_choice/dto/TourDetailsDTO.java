package com.example.travellers_choice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TourDetailsDTO {
    private Integer bookingId;
    private String userName;
    private String email;
    private String contact;
    private String packageName;
    private String region;
    private Integer noOfSeats;
    private Integer noOfAdults;
    private Integer noOfChildren;
    private String bookedAt;
    private String travelAt;
    private String status;
    private Double price;

    public TourDetailsDTO(Integer bookingId,String userName, String email, String contact, String packageName, String region, Integer noOfSeats,
                          Integer noOfAdults, Integer noOfChildren, String bookedAt,String travelAt, String status,Double price) {
        this.userName = userName;
        this.email = email;
        this.bookingId = bookingId;
        this.contact = contact;
        this.packageName = packageName;
        this.region = region;
        this.noOfSeats = noOfSeats;
        this.noOfAdults = noOfAdults;
        this.noOfChildren = noOfChildren;
        this.bookedAt = bookedAt;
        this.travelAt=travelAt;
        this.status=status;
        this.price=price;
    }
}

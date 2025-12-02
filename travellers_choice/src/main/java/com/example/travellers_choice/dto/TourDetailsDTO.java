package com.example.travellers_choice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TourDetailsDTO {
    private Integer tourId;
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

    public TourDetailsDTO(Integer tourId,String userName, String email, String contact, String packageName, String region, Integer noOfSeats,
                          Integer noOfAdults, Integer noOfChildren, String bookedAt,String travelAt, String status) {
        this.userName = userName;
        this.email = email;
        this.tourId = tourId;
        this.contact = contact;
        this.packageName = packageName;
        this.region = region;
        this.noOfSeats = noOfSeats;
        this.noOfAdults = noOfAdults;
        this.noOfChildren = noOfChildren;
        this.bookedAt = bookedAt;
        this.travelAt=travelAt;
        this.status=status;
    }
}

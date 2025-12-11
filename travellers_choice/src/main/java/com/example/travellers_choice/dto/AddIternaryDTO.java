package com.example.travellers_choice.dto;


import lombok.Data;

@Data
public class AddIternaryDTO {

    private Integer tourId;
    private Integer dayNumber;
    private String destination;
    private String description;

    public AddIternaryDTO( Integer tourId, Integer dayNumber,String destination, String description) {
        this.tourId = tourId;
        this.dayNumber = dayNumber;
        this.destination=destination;
        this.description = description;
    }
}

package com.example.travellers_choice.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddItineraryDTO {

    private Integer packageId;
    private Integer tourId;
    private Integer day;
    private String destination;
    private String description;

}

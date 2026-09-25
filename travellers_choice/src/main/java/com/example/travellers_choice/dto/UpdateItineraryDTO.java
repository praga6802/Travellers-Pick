package com.example.travellers_choice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateItineraryDTO {

    private Integer itineraryId;
    private Integer packageId;
    private Integer tourId;
    private Integer day;
    private String destination;
    private String description;
}
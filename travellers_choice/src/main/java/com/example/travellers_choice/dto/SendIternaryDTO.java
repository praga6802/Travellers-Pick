package com.example.travellers_choice.dto;

import lombok.Data;

@Data
public class SendIternaryDTO {
    private Integer tourId;
    private Integer dayNumber;
    private String destination;
    private String description;
    private String packageName;
    private String tourName;

    public SendIternaryDTO(Integer tourId,Integer dayNumber, String destination, String description, String packageName, String tourName) {
        this.dayNumber = dayNumber;
        this.destination = destination;
        this.description = description;
        this.packageName = packageName;
        this.tourName = tourName;
        this.tourId=tourId;
    }
}

package com.example.travellers_choice.dto;

import lombok.Data;

@Data
public class SendIternaryDTO {
    private Integer tourId;
    private Integer day;
    private String destination;
    private String description;
    private String packageName;
    private String tourName;

    public SendIternaryDTO(Integer tourId,Integer day, String destination, String description, String packageName, String tourName) {
        this.day = day;
        this.destination = destination;
        this.description = description;
        this.packageName = packageName;
        this.tourName = tourName;
        this.tourId=tourId;
    }
}

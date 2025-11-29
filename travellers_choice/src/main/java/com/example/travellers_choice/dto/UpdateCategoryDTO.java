package com.example.travellers_choice.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateCategoryDTO {

    private Integer tourId;
    private String tourName;
    private String tourSlogan;
    private String places;
    private Integer days;
    private Integer nights;
    private Double price;

    public UpdateCategoryDTO(String tourName, String tourSlogan, String places, Integer days, Integer nights, Double price) {
        this.tourName = tourName;
        this.tourSlogan = tourSlogan;
        this.places = places;
        this.days = days;
        this.nights = nights;
        this.price = price;
    }
}

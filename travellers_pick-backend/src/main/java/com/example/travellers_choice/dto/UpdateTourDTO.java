package com.example.travellers_choice.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
public class UpdateTourDTO {
    private String tourName;
    private String tourSlogan;
    private String places;
    private Integer days;
    private Integer nights;
    private Double price;
    private MultipartFile imageFile;

    public UpdateTourDTO(String tourName, String tourSlogan, String places, Integer days, Integer nights, Double price, MultipartFile imageFile) {
        this.imageFile=imageFile;
        this.tourName = tourName;
        this.tourSlogan = tourSlogan;
        this.places = places;
        this.days = days;
        this.nights = nights;
        this.price = price;
    }
}

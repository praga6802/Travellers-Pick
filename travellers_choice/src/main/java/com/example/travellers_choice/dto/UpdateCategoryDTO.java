package com.example.travellers_choice.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateCategoryDTO {

    private Integer packageId;
    private Integer tourId;
    private String tourName;
    private String tourSlogan;
    private String places;
    private Integer days;
    private Integer nights;
    private Double price;
    private String imgUrl;
    private String fileName;


    public UpdateCategoryDTO(Integer packageId, Integer tourId,String tourName, String tourSlogan, String places
            , Integer days, Integer nights, Double price,String imgUrl, String fileName) {
        this.tourName = tourName;
        this.tourSlogan = tourSlogan;
        this.places = places;
        this.days = days;
        this.nights = nights;
        this.packageId=packageId;
        this.tourId=tourId;
        this.price = price;
        this.imgUrl=imgUrl;
        this.fileName=fileName;
    }
}

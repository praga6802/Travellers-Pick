package com.example.travellers_choice.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
public class UploadCategoryDTO {

    private Integer packageId;
    private Integer tourId;
    private String tourName;
    private String tourSlogan;
    private String places;
    private Integer days;
    private Integer nights;
    private Double price;
    private MultipartFile imageFile;

    public UploadCategoryDTO(Integer packageId,Integer tourId,String tourName, String tourSlogan, String places, Integer days, Integer nights, Double price, MultipartFile imageFile) {
        this.tourName = tourName;
        this.imageFile=imageFile;
        this.tourSlogan = tourSlogan;
        this.places = places;
        this.days = days;
        this.nights = nights;
        this.price = price;
        this.packageId=packageId;
        this.tourId=tourId;
    }
}

package com.example.travellers_choice.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourDetailDTO {
    private String tourName;
    private String tourSlogan;
    private String places;
    private Integer days;
    private Integer nights;
    private Double price;
}

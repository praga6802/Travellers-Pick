package com.example.travellers_choice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourBookingDTO {
    private String packageName;
    private Integer tourId;
    private String tourName;
}

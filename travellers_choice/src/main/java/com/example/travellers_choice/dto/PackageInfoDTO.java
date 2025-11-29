package com.example.travellers_choice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PackageInfoDTO {
    private Integer packageId;
    private String packageName;

    public PackageInfoDTO(Integer packageId, String packageName) {
        this.packageId = packageId;
        this.packageName = packageName;
    }
}

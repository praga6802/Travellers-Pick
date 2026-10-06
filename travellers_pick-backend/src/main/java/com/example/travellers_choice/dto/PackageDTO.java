package com.example.travellers_choice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PackageDTO {
    private Integer packageId;
    private String packageName;
    private String packageSlogan;
    private String imgUrl;
    private String fileName;

    public PackageDTO(Integer packageId,String packageName, String packageSlogan, String imgUrl, String fileName) {
        this.packageName = packageName;
        this.packageSlogan = packageSlogan;
        this.imgUrl = imgUrl;
        this.packageId=packageId;
        this.fileName=fileName;
    }
}

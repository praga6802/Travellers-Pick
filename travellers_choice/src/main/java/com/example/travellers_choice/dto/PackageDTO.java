package com.example.travellers_choice.dto;

import lombok.Data;

@Data
public class PackageDTO {
    private String packageName;
    private String packageSlogan;

    public PackageDTO( String packageName, String packageSlogan) {
        this.packageName = packageName;
        this.packageSlogan = packageSlogan;
    }
}

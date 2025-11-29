package com.example.travellers_choice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdatePackageDTO {
    private Integer adminId;
    private Integer packageId;
    private String packageName;
    private String packageSlogan;

    public UpdatePackageDTO(Integer adminId, Integer packageId, String packageName, String packageSlogan) {
        this.adminId = adminId;
        this.packageId = packageId;
        this.packageName = packageName;
        this.packageSlogan = packageSlogan;
    }
}

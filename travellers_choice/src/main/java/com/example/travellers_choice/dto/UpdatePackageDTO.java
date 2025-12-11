package com.example.travellers_choice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
public class UpdatePackageDTO {
    private Integer adminId;
    private Integer packageId;
    private String packageName;
    private String packageSlogan;
    private MultipartFile imageFile;

    public UpdatePackageDTO(Integer adminId, Integer packageId, String packageName, String packageSlogan) {
        this.adminId = adminId;
        this.packageId = packageId;
        this.packageName = packageName;
        this.packageSlogan = packageSlogan;
    }
}

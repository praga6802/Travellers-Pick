package com.example.travellers_choice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
public class PackageUploadDTO {
    private String packageName;
    private String packageSlogan;
    private MultipartFile imageFile;

    public PackageUploadDTO(String packageName, String packageSlogan, MultipartFile imageFile) {
        this.packageName = packageName;
        this.packageSlogan = packageSlogan;
        this.imageFile = imageFile;
    }
}

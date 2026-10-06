package com.example.travellers_choice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
public class UpdatePackageDTO {
    private String packageName;
    private String packageSlogan;
    private MultipartFile imageFile;
}

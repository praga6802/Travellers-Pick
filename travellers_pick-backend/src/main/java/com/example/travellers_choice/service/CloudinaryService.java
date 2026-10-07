package com.example.travellers_choice.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.travellers_choice.exception.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary){
        this.cloudinary=cloudinary;
    }

    public String uploadImage(MultipartFile image, String folder_name){
        if(image==null || image.isEmpty() || image==null){
            throw new BusinessException("Image file cannot be empty!");
        }

        try {
            Map<?,?> result = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.asMap(
                    "folder","travellers-pick/"+folder_name
            ));

            return (String) result.get("secure_url");

        }
        catch (Exception e){
            e.printStackTrace();
            throw new BusinessException("Failed to upload Image!");
        }
    }
}

package com.example.travellers_choice.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminDTO {
    private String username;
    private String email;
    private String password;
    private String contact;
    private String newPassword;

    public AdminDTO(String username, String email, String password, String contact) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.contact = contact;
    }
}

package com.example.travellers_choice.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private String username;
    private String email;
    private String contact;

    public UserDTO(String username, String email, String contact) {
        this.username = username;
        this.email = email;
        this.contact = contact;
    }
}



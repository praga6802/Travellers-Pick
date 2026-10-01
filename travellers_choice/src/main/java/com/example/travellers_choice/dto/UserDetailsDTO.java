package com.example.travellers_choice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsDTO {
    private Integer userId;
    private String username;
    private String email;
    private String contact;
    private String role;
}

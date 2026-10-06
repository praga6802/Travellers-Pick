package com.example.travellers_choice.dto;


import com.example.travellers_choice.model.Admin;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminDTO {
    private Integer adminId;
    private String username;
    private String email;
    private String password;
    private String contact;
    private String newPassword;

}

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

    public AdminDTO(String username, String email, String password, String contact) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.contact = contact;
    }

    public AdminDTO(Admin admin){
        this.adminId=admin.getAdminId();
        this.username=admin.getUsername();
        this.email=admin.getEmail();
        this.contact=admin.getContact();
    }

}

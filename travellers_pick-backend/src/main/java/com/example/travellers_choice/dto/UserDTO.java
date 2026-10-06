package com.example.travellers_choice.dto;


import com.example.travellers_choice.model.Customer;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.User;

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

    public UserDTO(Customer user){
        this.username=user.getUsername();
        this.email=user.getEmail();
        this.contact=user.getContact();
    }
}



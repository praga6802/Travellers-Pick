package com.example.travellers_choice.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

@Entity
@Data
public class CustomerRegistry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @ManyToOne
    @JoinColumn(name="userId", nullable = false)
    private Customer user;
    private String name;
    private String email;
    private String phone;
    private String packageName;
    private String region;
    private String bdate;
    private String tdate;
    private Integer noOfSeats;
    private Integer noOfAdults;
    private Integer noOfChildren;
    private String city;
    private String state;
    private String country;

}

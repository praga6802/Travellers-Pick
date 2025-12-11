package com.example.travellers_choice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CustomerRegistry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")  // matches DB
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false) // matches DB
    private Customer user;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    private String name;
    private String email;
    private String phone;

    @Column(name="package_name")
    private String packageName;

    private String region;
    private String bdate;
    private String tdate;
    private Double price;

    @Column(name="no_of_seats")
    private Integer noOfSeats;

    @Column(name="no_of_adults")
    private Integer noOfAdults;

    @Column(name="no_of_children")
    private Integer noOfChildren;

    private String city;
    private String state;
    private String country;
    private String status;

    @Column(name="pnr_no",unique = true)
    private String PNR;


}

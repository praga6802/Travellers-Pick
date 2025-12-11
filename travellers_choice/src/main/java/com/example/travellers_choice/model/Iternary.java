package com.example.travellers_choice.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Iternary{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="tour_id")
    private Tour tour;

    @ManyToOne
    @JoinColumn(name="packageId")
    private Packages pkg;

    @Column(name="dayNumber",nullable = false)
    private Integer dayNumber;

    @Column(name="destination",nullable = false)
    private String destination;

    @Lob
    @Column(name="description",nullable = false, columnDefinition = "TEXT")
    private String description;




}

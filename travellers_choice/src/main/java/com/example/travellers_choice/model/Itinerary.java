package com.example.travellers_choice.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="tour_id")
    private Tour tour;

    @ManyToOne
    @JoinColumn(name="package_id")
    private Packages packages;

    @Column(name="day",nullable = false)
    private Integer day;

    @Column(name="destination",nullable = false)
    private String destination;

    @Lob
    @Column(name="description",nullable = false, columnDefinition = "TEXT")
    private String description;


}

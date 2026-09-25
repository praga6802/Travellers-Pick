package com.example.travellers_choice.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tourId;

    @ManyToOne
    @JoinColumn(name = "packageId", nullable = false)
    @JsonBackReference
    private Packages packages;

    private String tourName;
    private String tourSlogan;
    private String places;
    private Integer days;
    private Integer nights;
    private Double price;
    private String imgUrl;

    @OneToMany(mappedBy = "tour",cascade = CascadeType.ALL)
    private List<Itinerary> iternaryList;
}

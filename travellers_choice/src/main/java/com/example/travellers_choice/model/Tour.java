package com.example.travellers_choice.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tourId;

    @ManyToOne
    @JoinColumn(name = "packageId", nullable = false)
    @JsonBackReference
    private Packages packageName;

    private String tourName;
    private String tourSlogan;
    private String places;
    private Integer days;
    private Integer nights;
    private Double price;
    private String imgUrl;


    @JsonProperty("packageId")
    public int getPackageId() {
        return packageName != null ?packageName.getPackageId():0;

    }
}

package com.example.travellers_choice.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Packages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="package_id")
    private int packageId;

    @Column(name="package_name", nullable = false, unique = true)
    private String packageName;

    @Column(name="package_slogan",nullable = false, unique = true)
    private String packageSlogan;

    @Column(name="imgUrl", nullable = false)
    private String imgUrl;

    @Column(name="packageCode",nullable = false)
    private String packageCode;

    @OneToMany(mappedBy = "packageName", orphanRemoval = true, cascade =CascadeType.ALL)
    @JsonManagedReference
    List<Tour> tours;

}

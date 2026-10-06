package com.example.travellers_choice.repository;

import com.example.travellers_choice.model.Packages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PackageRepo extends JpaRepository<Packages, Integer> {

    boolean existsByPackageName(String packageName);


    Optional<Packages> findByPackageName(String packageName);


}


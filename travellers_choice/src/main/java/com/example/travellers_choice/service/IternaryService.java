package com.example.travellers_choice.service;

import com.example.travellers_choice.dto.AResponse;
import com.example.travellers_choice.dto.AddIternaryDTO;
import com.example.travellers_choice.dto.SendIternaryDTO;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.Iternary;
import com.example.travellers_choice.model.Packages;
import com.example.travellers_choice.model.Tour;
import com.example.travellers_choice.repository.AdminRepo;
import com.example.travellers_choice.repository.IternaryRepo;
import com.example.travellers_choice.repository.PackageRepo;
import com.example.travellers_choice.repository.TourRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IternaryService {

    @Autowired
    AdminRepo adminRepo;

    @Autowired
    PackageRepo packageRepo;

    @Autowired
    TourRepo tourRepo;

    @Autowired
    IternaryRepo iternaryRepo;

    //add Iternary
    public ResponseEntity<?> addIternary(AddIternaryDTO addIternaryDTO, String email) {

        Admin admin=adminRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("Admin Email",email));
        Tour tour=tourRepo.findById(addIternaryDTO.getTourId()).orElseThrow(()-> new IDNotFoundException("Tour ID",addIternaryDTO.getTourId()));

        Iternary it= new Iternary();
        it.setDayNumber(addIternaryDTO.getDayNumber());
        it.setDescription(addIternaryDTO.getDescription());
        it.setDestination(addIternaryDTO.getDestination());
        it.setTour(tour);

        iternaryRepo.save(it);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Iternary added successfully"));
    }

    public List<SendIternaryDTO> allIternaries() {
        return iternaryRepo.findAll().stream()
                .map(it-> new SendIternaryDTO(it.getTour().getTourId(),it.getDayNumber(),it.getDestination(),
                        it.getDescription(),it.getPkg().getPackageName(),it.getTour().getTourName())).toList();
    }
}

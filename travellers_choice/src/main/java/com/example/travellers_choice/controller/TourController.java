package com.example.travellers_choice.controller;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.Tour;
import com.example.travellers_choice.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tour")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class TourController {

    @Autowired
    TourService tourService;


    @PostMapping("/addtour")
    public ResponseEntity<?> addTour(@RequestParam("packageName")int packageName, @ModelAttribute Tour tour, @RequestParam("adminId") int adminId,
                                     @RequestParam("password") String password){
        Tour addTour= tourService.addTour(packageName,tour,adminId, password);
        return ResponseEntity.ok(Map.of("message","Tour Added Successfully"));

    }

    @PutMapping("/updatetour")
    public ResponseEntity<?> updateTour(@RequestParam("packageName")int packageId, @ModelAttribute Tour tour, @RequestParam("adminId") int adminId,
                                     @RequestParam("password") String password){
        Tour addTour= tourService.updateTour(packageId,tour,adminId, password);
        return ResponseEntity.ok(Map.of("message","Tour Updated Successfully"));

    }


    @DeleteMapping("/deletetour")
    public ResponseEntity<Map<String,String>> deleteTour(@RequestParam("packageName") int packageId, @RequestParam("tourId") int tourId, @RequestParam("adminId")int adminID,
                                                         @RequestParam("password") String password){

        boolean deleteTour=tourService.deleteTour(packageId, tourId,adminID,password);
        if(deleteTour)
            return ResponseEntity.ok(Map.of("message","Tour deleted Successfully"));
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","Package deletion Failed"));
    }

    @GetMapping("/alltour")
    public ResponseEntity<List<Tour>> getAllTours(){
        List<Tour> allTours=tourService.getAllTours();
        return ResponseEntity.ok(allTours);
    }


    @GetMapping("/getTour/{packageID}/{tourID}")
    public ResponseEntity<?> getTourById(@PathVariable Integer packageID,@PathVariable Integer tourID){
        Tour tour=tourService.getTourByID(packageID,tourID);
        return ResponseEntity.ok(tour);
    }

}

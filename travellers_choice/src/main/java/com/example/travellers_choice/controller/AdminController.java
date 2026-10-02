package com.example.travellers_choice.controller;

import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.service.AdminService;
import com.example.travellers_choice.service.IternaryService;
import com.example.travellers_choice.service.PackageService;
import com.example.travellers_choice.service.TourService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/admin")
public class AdminController {


    @Autowired
    AdminService adminService;

    @Autowired
    PackageService packageService;

    @Autowired
    TourService tourService;

    @Autowired
    IternaryService iternaryService;


    //sign up admin
    @PostMapping("/signup")
    public ResponseEntity<AResponse> signUp(@RequestBody UserRegisterDTO admin){
        return adminService.signUp(admin);
    }

    //login admin
    @PostMapping("/login")
    public ResponseEntity<AResponse> adminLogin(@RequestBody LoginDTO loginData, HttpSession session) {
        return adminService.adminLogin(loginData.getEmail(),loginData.getPassword(),session);
    }

    //get the current admin
    @GetMapping("/current-admin")
    public ResponseEntity<AResponse> getCurrentAdmin(@AuthenticationPrincipal UserDetails userDetails) {
        return adminService.getCurrentAdmin(userDetails);
    }

    //logout admin
    @PostMapping("/logout")
    public ResponseEntity<AResponse> logout(HttpSession session){
       return adminService.logout(session);
    }


    // UPDATE ADMIN
    @PatchMapping("/update")
    public ResponseEntity<AResponse> updateAdmin(@RequestBody AdminDTO admin, @AuthenticationPrincipal UserDetails userDetails){
        return adminService.updateAdmin(admin,userDetails.getUsername());
    }


    //DELETE ADMIN
    @DeleteMapping("/delete")
    public ResponseEntity<AResponse> deleteAdmin(@RequestBody DeleteAdminDTO deleteAdminDTO, @AuthenticationPrincipal UserDetails userDetails){
        return adminService.deleteAdmin(deleteAdminDTO.getAdminId(), deleteAdminDTO.getPassword(), userDetails.getUsername());
    }

    //GET ADMIN BY ID
    @GetMapping("/admins/{adminId}")
    public ResponseEntity<AResponse> getAdmin(@PathVariable("adminId") Integer adminId){
        return adminService.getAdmin(adminId);
    }

    //get all admins
    @GetMapping("/admins")
    public ResponseEntity<AResponse> getAllAdmins(){
        return adminService.getAllAdmins();
    }

    // get all booked users 
    @GetMapping("/bookings/users")
    public ResponseEntity<AResponse> getAllUsers(){
        return adminService.getAllRegUsers();
    }

    //get all users
    @GetMapping("/users")
    public ResponseEntity<AResponse> getAllCustomers(){
        return adminService.getAllCustomers();
    }


                                                    // --- PACKAGE ---
    //ADD PACKAGE
    @PostMapping(value = "/packages", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AResponse> addPackage(@ModelAttribute PackageUploadDTO dto){
      return packageService.addPackage(dto);
    }


    //UPDATE PACKAGE
    @PutMapping(value = "/packages/{packageId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AResponse> updatePackage(@PathVariable Integer packageId, @ModelAttribute UpdatePackageDTO updatePackageDTO) {
        return packageService.updatePackage(packageId,updatePackageDTO);
    }

    //DELETE PACKAGE
    @DeleteMapping("/packages/{packageId}")
    public ResponseEntity<AResponse> deletePackage(@PathVariable Integer packageId){
         return packageService.deletePackage(packageId);
    }

    //GET ALL PACKAGES
    @GetMapping("/packages")
    public ResponseEntity<AResponse> getAllPackages() {
        return packageService.getAllPackages();
    }

    // get all package names
    @GetMapping("/package-names")
    public ResponseEntity<AResponse> getAllPackageNames(){
        return packageService.getAllPackageNames();
    }

    //GET PACKAGE Details BY ID
    @GetMapping("/packages/{package_id}")
    public ResponseEntity<AResponse> getPackageById(@PathVariable Integer package_id){
        return packageService.getPackageById(package_id);
    }



                                                    //  --- Tour Service ---

    //add tour
    @PostMapping(value = "/packages/{packageId}/tours",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AResponse> addTour(@PathVariable Integer packageId, @ModelAttribute UpdateTourDTO categoryDTO){
        return tourService.addTour(packageId,categoryDTO);
    }

    // update tour
    @PutMapping(value = "/packages/{packageId}/tours/{tourId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AResponse> updateTour(@PathVariable Integer packageId, @PathVariable Integer tourId, @ModelAttribute UpdateTourDTO categoryDTO){
        return tourService.updateTour(packageId,tourId,categoryDTO);
    }

    // delete tour
    @DeleteMapping("/packages/{packageId}/tours/{tourId}")
    public ResponseEntity<AResponse> deleteTour(@PathVariable Integer packageId, @PathVariable Integer tourId){
        return tourService.deleteTour(packageId,tourId);
    }

    //get tours list
    @GetMapping("/tours")
    public ResponseEntity<AResponse> getAllTours(){
        return tourService.getAllTours();
    }

    // get tour list by packageId - tour names
    @GetMapping("/packages/{packageId}/tours")
    public ResponseEntity<AResponse> getToursByPackageId(@PathVariable Integer packageId){
        return tourService.getToursByPackageId(packageId);
    }

    // get tour by packageid, tourid
    @GetMapping("/packages/{packageId}/tours/{tourId}")
    public ResponseEntity<AResponse> getTourById(@PathVariable Integer packageId,@PathVariable Integer tourId){
        return tourService.getTourByID(packageId,tourId);
    }


                                                    // Itinerary Service //

    //add itinerary
    @PostMapping("/packages/{packageId}/tours/{tourId}/itineraries")
    public ResponseEntity<AResponse> addItinerary(@PathVariable Integer packageId, @PathVariable Integer tourId, @RequestBody ItineraryDTO addItineraryDTO){
        return iternaryService.addItinerary(packageId,tourId,addItineraryDTO);
    }

    // update Itinerary
    @PatchMapping("/packages/{packageId}/tours/{tourId}/itineraries/{itineraryId}")
    public ResponseEntity<AResponse> updateItinerary(@PathVariable Integer packageId,@PathVariable Integer tourId, @PathVariable Integer itineraryId,
                                                     @RequestBody ItineraryDTO updateItineraryDTO){
        return iternaryService.updateItinerary(packageId,tourId,itineraryId, updateItineraryDTO);
    }

    @DeleteMapping("/packages/{packageId}/tours/{tourId}/itineraries/{itineraryId}")
    public ResponseEntity<AResponse> deleteItinerary(@RequestBody DeleteItineraryDTO deleteItineraryDTO){
        return iternaryService.deleteItinerary(deleteItineraryDTO);
    }

    @GetMapping("/itineraries")
    public ResponseEntity<AResponse> getItineraries(){
        return iternaryService.getItineraries();
    }

    @GetMapping("/packages/{packageId}/tours/{tourId}/days")
    public ResponseEntity<AResponse> getDay(@PathVariable Integer packageId, @PathVariable Integer tourId){
        return iternaryService.getDay(packageId,tourId);
    }

    // fetch the details with packageid, tourid, and day -> description and destination
    @GetMapping("/packages/{packageId}/tours/{tourId}/itineraries/{day}")
    public ResponseEntity<AResponse> getItinerary(@PathVariable Integer packageId, @PathVariable Integer tourId, @PathVariable Integer day){
        return iternaryService.getItinerary(packageId,tourId,day);
    }



                                                    // Admin Dashboard //

    // Get the total number of cancelled admins
    @GetMapping("/admins/count")
    public ResponseEntity<AResponse> getAdminsCount(){
        return adminService.getAdminsCount();
    }

    // Get the total number of cancelled users
    @GetMapping("/users/count")
    public ResponseEntity<AResponse> getUsersCount(){
        return adminService.getUsersCount();
    }

    // Get the total number of packages
    @GetMapping("/packages/count")
    public ResponseEntity<AResponse> getPackagesCount(){
        return adminService.getPackagesCount();
    }

    // Get the total number of tours
    @GetMapping("/tours/count")
    public ResponseEntity<AResponse> getToursCount(){
        return adminService.getToursCount();
    }

    // Get the total number of bookings
    @GetMapping("/bookings/count")
    public ResponseEntity<AResponse> getBookingsCount(){
        return adminService.getBookingsCount();
    }

    // Get the total number of confirmed bookings
    @GetMapping("/bookings/confirmed/count")
    public ResponseEntity<AResponse> getConfirmedCount(){
        return adminService.getConfirmedCount();
    }

    // Get the total number of cancelled bookings
    @GetMapping("/bookings/cancelled/count")
    public ResponseEntity<AResponse> getCancelledCount(){
        return adminService.getCancelledCount();
    }
}

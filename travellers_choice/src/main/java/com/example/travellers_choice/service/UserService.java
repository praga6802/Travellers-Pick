package com.example.travellers_choice.service;

import com.example.travellers_choice.dto.*;
import com.example.travellers_choice.exception.*;
import com.example.travellers_choice.model.*;
import com.example.travellers_choice.repository.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;


@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CustomerRegister registerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TourRepo tourRepo;

    @Autowired
    private OTPRepo otpRepo;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private ItineraryRepository itineraryRepository;

    //user sign up
    public ResponseEntity<AResponse> userSignUp(UserRegisterDTO user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new AlreadyExistsException("Email",user.getEmail());
        }

        if (userRepo.existsByContact(user.getContact())) {
           throw new AlreadyExistsException("Contact",user.getContact());
        }

        Customer customer = new Customer();
        customer.setUsername(user.getUsername());
        customer.setEmail(user.getEmail());
        customer.setPassword(passwordEncoder.encode(user.getPassword()));
        customer.setContact(user.getContact());
        customer.setRole("ROLE_USER");
        userRepo.save(customer);

//        String sub = "Welcome to Traveller’s Pick – Your Account is Ready!";
//        String message = "Hi " + customer.getUsername() + ",\n\n"
//                + "Thank you for signing up with Traveller’s Choice!\n"
//                + "Your account has been created successfully, and you’re all set to explore the best travel experiences.\n\n"
//                + "What you can do next:\n"
//                + "- Browse and book your dream destinations.\n"
//                + "- Manage your bookings easily.\n"
//                + "If this wasn’t you, please ignore this email.\n\n"
//                + "If you need any help, feel free to reply — we’re always here to assist you!\n\n"
//                + "Best Regards,\n"
//                + "Traveller’s Pick Team\n"
//                + "© " + java.time.Year.now() + " Traveller’s Pick. All Rights Reserved.";
//
//        emailService.sendSimpleEMail(customer.getEmail(), sub, message);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Sign Up Successfully"));
    }

    //login
    public ResponseEntity<AResponse> userLogin(LoginDTO login, HttpSession session) {
            Authentication auth=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(login.getEmail(),login.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(auth);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,SecurityContextHolder.getContext());
            return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Login Successful"));
    }

    //current login user
    public ResponseEntity<AResponse> getCurrentUser(UserDetails userDetails) {
        if (userDetails == null){
            throw new UnAuthorizedException("Session Expired! Please try again!");
        }
        String email=userDetails.getUsername();

        Customer user=userRepo.findUserByEmail(email).orElseThrow(()-> new UnAuthorizedException("Email "+email+" not found"));
        UserDetailsDTO currentUser =  new UserDetailsDTO(user.getId(),user.getUsername(),user.getEmail(),user.getContact(),user.getRole());
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",currentUser));
    }

    //logout user
    public ResponseEntity<AResponse> logout(HttpSession session) {
        if(session!=null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Logout Successfully"));
    }


    //generate PNR
    public String generatePNR(){
        SecureRandom random= new SecureRandom();
        String letter=""+(char)('A'+ random.nextInt(26))+(char)('A'+ random.nextInt(26));
        Long number=1000+random.nextLong(9000);
        return "TP-"+letter+number;
    }

    //generate OTP
    public String generateOTP(){
        Random random= new Random();
        int otp=100000+ random.nextInt(900000);
        return String.valueOf(otp);
    }

    //book tour
    public ResponseEntity<AResponse> bookTour(BookTourDTO bookTourDTO) {
        Customer user = userRepo.findById(bookTourDTO.getUserId()).orElseThrow(() ->new IDNotFoundException("User ID", bookTourDTO.getUserId()));
        Tour tour=tourRepo.findById(bookTourDTO.getTourId()).orElseThrow(()-> new IDNotFoundException("Tour ID",bookTourDTO.getTourId()));

        if(bookTourDTO==null){
            throw new BusinessException("Please enter details to book tour!");
        }
        BookingRegistry book = new BookingRegistry();
        book.setUser(user);
        book.setTour(tour);

        book.setName(bookTourDTO.getName());
        book.setEmail(bookTourDTO.getEmail());
        book.setPhone(bookTourDTO.getPhone());
        book.setPackageName(bookTourDTO.getPackageName());
        book.setRegion(bookTourDTO.getRegion());
        book.setBdate(bookTourDTO.getBdate());
        book.setTdate(bookTourDTO.getTdate());
        book.setNoOfSeats(bookTourDTO.getNoOfSeats());
        book.setNoOfAdults(bookTourDTO.getNoOfAdults());
        book.setNoOfChildren(bookTourDTO.getNoOfChildren());
        book.setCity(bookTourDTO.getCity());
        book.setState(bookTourDTO.getState());
        book.setCountry(bookTourDTO.getCountry());
        book.setPrice(tour.getPrice());
        book.setStatus("CONFIRMED");

        String pnr=generatePNR();
        book.setPNR(pnr);
        registerRepo.save(book);

//        if(bookTourDTO.getEmail()!=null && !bookTourDTO.getEmail().isBlank()){
//            String subject="Confirmation of Tour Booking!";
//            String body = "Hi " + user.getUsername() + ",\n\n"
//                    + "Your tour has been booked successfully for the package: " + bookTourDTO.getRegion() + ".\n\n"
//                    +"Booking Details:\n"
//                    +"Booking ID: "+book.getBookingId()+"\n"
//                    +"Passenger Name: "+bookTourDTO.getName()+"\n"
//                    +"Email: "+bookTourDTO.getEmail()+"\n"
//                    +"Contact: "+bookTourDTO.getPhone()+"\n"
//                    +"Booked Date: " + bookTourDTO.getBdate() + "\n"
//                    +"Travel Date: " + bookTourDTO.getTdate() + "\n"
//                    +"Number of Seats: " + bookTourDTO.getNoOfSeats() + "\n"
//                    +"Price: "+tour.getPrice()+"\n"
//                    +"From: "+bookTourDTO.getCity()+", "+bookTourDTO.getState()+"\n\n"
//                    +"Your PNR number is: " + pnr + ". Kindly use this PNR for any future ticket cancellation or support requests.\n\n"
//                    +"Thank you for choosing Traveller's Pick!\n";
//            emailService.sendSimpleEMail(bookTourDTO.getEmail(),subject,body);
//        }
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Tour Booked Successfully"));
    }


    //update user profile
    public ResponseEntity<AResponse> updateUser(UserDTO userDTO, String email) {
        Customer user = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Email "+email+" not found"));

        boolean isUpdated = false;

        // Update username
        if (userDTO.getUsername() != null && !userDTO.getUsername().isBlank() && !userDTO.getUsername().equals(user.getUsername())) {
            user.setUsername(userDTO.getUsername());
            isUpdated = true;
        }

        // Update contact
        if (userDTO.getContact() != null && !userDTO.getContact().isBlank() && !userDTO.getContact().equals(user.getContact())) {
            user.setContact(userDTO.getContact());
            isUpdated = true;
        }

        // Update email
        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank() && !userDTO.getEmail().equals(user.getEmail())) {

            if (userRepo.existsByEmail(userDTO.getEmail())) {
                throw new AlreadyExistsException(userDTO.getEmail(),"Email already taken!");
            }
            return verificationEmail(userDTO.getEmail(), user);
        }

        if (!isUpdated) {
           throw new BusinessException("No fields were updated!");
        }

        userRepo.save(user);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "User Details Updated Successfully"));
    }

    //verification of email
    public ResponseEntity<AResponse> verificationEmail(String newEmail, Customer user){
        String otp=generateOTP();

        otpRepo.deleteAllByUserAndPurpose(user,"EMAIL_UPDATE");

        OTPVerification otpTab= new OTPVerification();
        otpTab.setOtp(passwordEncoder.encode(otp));
        otpTab.setUser(user);
        otpTab.setPurpose("EMAIL_UPDATE");
        otpTab.setValue(newEmail);
        otpTab.setCreatedAt(LocalDateTime.now());
        otpTab.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpRepo.save(otpTab);

        String sub="Email Updation, Verify OTP Code";
//        String message="Hi "+user.getUsername()+","+"\n"+
//                "We received a request to change the email address associated with your account.\n"+
//                "To confirm this change, please use the OTP code below:\n"+
//                "OTP: "+otp+"\n" +
//                "Do not share this code with anyone.\n\n" +
//                "If you did not request this change, please ignore this email or contact support immediately.\n" +
//                "Thanks & Regards,\n" +
//                "Traveller's Pick Team.\n";
//
//         emailService.sendSimpleEMail(newEmail,sub,message); //send email with otp
        System.out.println("SEND OTP :"+otp);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","OTP has been sent to the "+newEmail
                +". Please enter the OTP to update your email"));
    }

    //verify otp
    public ResponseEntity<AResponse> verifyOTP(String email, String enteredOtp) throws JsonProcessingException {
        Customer user= userRepo.findUserByEmail(email).orElseThrow(()->new UnAuthorizedException("Email"+ email+" not found"));


        System.out.println("ENTERED OTP:"+enteredOtp);
        //check the user purpose for updating: email update
        OTPVerification otp=otpRepo.findByUserAndPurpose(user,"EMAIL_UPDATE").orElseThrow(()->new UnAuthorizedException("Email"+ email+" not found"));

        if(otp.getExpiryTime().isBefore(LocalDateTime.now())){
            otpRepo.delete(otp);
            return ResponseEntity.status(HttpStatus.GONE).body(new AResponse(LocalDateTime.now(),"Failure","OTP has expired!"));
        }
        if(!passwordEncoder.matches(enteredOtp,otp.getOtp())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AResponse(LocalDateTime.now(),"Failure","The entered OTP does not match!"));
        }
        user.setEmail(otp.getValue());//setting the new email
        userRepo.save(user); //saving the user in repo

        otpRepo.delete(otp);//deleting the otp request

        //after updating email, changing the spring security session
        Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        UserDetails newUserDetails=userDetailsService.loadUserByUsername(user.getEmail());
        Authentication newAuth = new UsernamePasswordAuthenticationToken(newUserDetails,auth.getCredentials(),newUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(newAuth);

        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success", "Email Updated Successfully"));
    }

    //get all booked tours
    public ResponseEntity<AResponse> getAllBookings(String email) {
        Customer user = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("User Email "+ email+" not found"));

        List<BookingRegistry> userBookings=registerRepo.findByUser_Id(user.getId());
        if(userBookings.isEmpty()){
            throw new ResourceNotFoundException("Bookings");
        }

        List<TourDetailsDTO> bookingList=userBookings.stream()
                .map(t->new TourDetailsDTO(t.getBookingId(),t.getName(),t.getEmail(),t.getPhone(),t.getPackageName(),t.getRegion(),t.getNoOfSeats(),
                        t.getNoOfAdults(),t.getNoOfChildren(),t.getBdate(),t.getTdate(),t.getStatus(),t.getPrice())).toList();

        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",bookingList));
    }


    //cancel tour
    public ResponseEntity<AResponse> cancelBooking(String pnr, String email) {
        Customer user = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("User Email"+ email+ " not found"));

        if(pnr==null){
            throw new BusinessException("Please enter PNR number to cancel booking!");
        }
        BookingRegistry reg=registerRepo.findByPNR(pnr).orElseThrow(()->new UnAuthorizedException("pnr number"+ pnr +" not found"));

        if (!reg.getUser().getId().equals(user.getId())) {
            throw new BusinessException("Invalid pnr");
        }
        if(reg.getStatus().equals("CANCELLED")){
           throw new AlreadyExistsException(String.valueOf(reg.getBookingId()),"Already Cancelled");
        }

        reg.setStatus("CANCELLED");
        registerRepo.save(reg);

        if(user.getEmail()!=null && !user.getEmail().isEmpty()){
            String subject="Cancellation of Ticket Booking!";
            String body = "Hi " + user.getUsername() + ",\n"
                    + "Your ticket has been cancelled successfully for the package: " + reg.getRegion() + ".\n"
                    + "We look forward to helping you book your next tour in the future!"+"\n\n"
                    +"By Traveller's Pick.";

            emailService.sendSimpleEMail(reg.getEmail(),subject,body);
        }
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Cancellation Successful!"));
    }


    // get tour details submitting form
    public ResponseEntity<AResponse> getTour(Integer tourId) {
        Tour tour = tourRepo.findById(tourId).orElseThrow(()-> new IDNotFoundException("Tour ID",tourId));
        TourBookingDTO tourBookingDTO = new TourBookingDTO(tour.getPackages().getPackageName(),tour.getTourId(),tour.getTourName());
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success",tourBookingDTO));
    }
}

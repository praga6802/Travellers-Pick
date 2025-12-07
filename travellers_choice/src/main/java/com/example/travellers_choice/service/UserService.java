package com.example.travellers_choice.service;

import com.example.travellers_choice.dto.AResponse;
import com.example.travellers_choice.dto.BookTourDTO;
import com.example.travellers_choice.dto.TourDetailsDTO;
import com.example.travellers_choice.dto.UserDTO;
import com.example.travellers_choice.exception.AlreadyExistsException;
import com.example.travellers_choice.exception.IDNotFoundException;
import com.example.travellers_choice.exception.UnAuthorizedException;
import com.example.travellers_choice.model.Admin;
import com.example.travellers_choice.model.ApiResponse;
import com.example.travellers_choice.model.Customer;
import com.example.travellers_choice.model.CustomerRegistry;
import com.example.travellers_choice.repository.CustomerRegister;
import com.example.travellers_choice.repository.UserRepo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    CustomerRegister registerRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    EmailService emailService;

    //user sign up
    public ResponseEntity<?> customerSignUp(Customer customer) {
        if (userRepo.existsByContact(customer.getContact())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AlreadyExistsException("Mobile Number", customer.getContact()));
        }
        if (userRepo.existsByEmail(customer.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AlreadyExistsException("Email ID", customer.getEmail()));
        }
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customer.setRole("ROLE_USER");
        userRepo.save(customer);
        String sub="Welcome to Traveller’s Pick – Your Account is Ready!";
        String message = "Hi " + customer.getUsername() + ",\n\n"
                + "Thank you for signing up with Traveller’s Choice!\n"
                + "Your account has been created successfully, and you’re all set to explore the best travel experiences.\n\n"
                + "What you can do next:\n"
                + "- Browse and book your dream destinations.\n"
                + "- Manage your bookings easily.\n"
                + "If this wasn’t you, please ignore this email.\n\n"
                + "If you need any help, feel free to reply — we’re always here to assist you!\n\n"
                + "Best Regards,\n"
                + "Traveller’s Pick Team\n"
                + "© " + java.time.Year.now() + " Traveller’s Pick. All Rights Reserved.";

        emailService.sendSimpleEMail(customer.getEmail(),sub,message);
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Sign Up Successfully"));
    }

    //login
    public ResponseEntity<?> customerLogin(String email, String password, HttpSession session) {
        try {
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            SecurityContextHolder.getContext().setAuthentication(auth);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            Customer customer = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Invalid Credentials", email));
            session.setAttribute("LoggedUser", customer);
            return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Login Successful"));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).
                    body(new AResponse(LocalDateTime.now(), "Failure", "Invalid Email or Password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).
                    body(new AResponse(LocalDateTime.now(), "Failure", "Something went wrong"));
        }
    }

    //current logged in user
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Customer user = (Customer) session.getAttribute("LoggedUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AResponse(LocalDateTime.now(), "Failure", "No Active Session user"));
        }
        Map<String,Object> response= new HashMap<>();
        response.put("userId",user.getId());
        response.put("userName",user.getUsername());
        response.put("userEmail",user.getEmail());
        response.put("userContact",user.getContact());
        return ResponseEntity.ok(response);
    }

    //logout user
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
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

    //book tour
    public ResponseEntity<?> bookCategory(BookTourDTO bookTourDTO, String email) {
        Customer user = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("Email ID", email));
        Customer loggedUser = userRepo.findById(bookTourDTO.getUserId())
                .orElseThrow(() -> new IDNotFoundException("User ID", bookTourDTO.getUserId()));

        CustomerRegistry book = new CustomerRegistry();
        book.setUser(loggedUser);
        book.setName(bookTourDTO.getName() != null ? bookTourDTO.getName() : "No Name");
        book.setEmail(bookTourDTO.getEmail() != null ? bookTourDTO.getEmail() : "No Email");
        book.setPhone(bookTourDTO.getPhone() != null ? bookTourDTO.getPhone() : "No Mobile Number");
        book.setPackageName(bookTourDTO.getPackageName() != null ? bookTourDTO.getPackageName() : "No Package Name");
        book.setRegion(bookTourDTO.getRegion() != null ? bookTourDTO.getRegion() : "No Region");
        book.setBdate(bookTourDTO.getBdate() != null ? bookTourDTO.getBdate() : "No date");
        book.setTdate(bookTourDTO.getTdate() != null ? bookTourDTO.getTdate() : "No date");
        book.setNoOfSeats(bookTourDTO.getNoOfSeats() != null ? bookTourDTO.getNoOfSeats() : 0);
        book.setNoOfAdults(bookTourDTO.getNoOfAdults() != null ? bookTourDTO.getNoOfAdults() : 0);
        book.setNoOfChildren(bookTourDTO.getNoOfChildren() != null ? bookTourDTO.getNoOfChildren() : 0);
        book.setCity(bookTourDTO.getCity() != null ? bookTourDTO.getCity() : "No city");
        book.setState(bookTourDTO.getState() != null ? bookTourDTO.getState() : "No state");
        book.setCountry(bookTourDTO.getCountry() != null ? bookTourDTO.getCountry() : "No country");
        book.setStatus("CONFIRMED");

        String pnr=generatePNR();
        book.setPNR(pnr);
        registerRepo.save(book);


        if(bookTourDTO.getEmail()!=null && !bookTourDTO.getEmail().isEmpty()){
            String subject="Confirmation of Tour Booking!";
            String body = "Hi " + bookTourDTO.getName() + ",\n\n"
                    + "Your tour has been booked successfully for the package: " + bookTourDTO.getRegion() + ".\n\n"
                    + "Booking Details:\n"
                    +"Passenger Name: "+bookTourDTO.getName()+"\n"
                    +"Email: "+bookTourDTO.getEmail()+"\n"
                    +"Contact: "+bookTourDTO.getPhone()+"\n"
                    + "Booked Date: " + bookTourDTO.getBdate() + "\n"
                    + "Travel Date: " + bookTourDTO.getTdate() + "\n"
                    + "Number of Seats: " + bookTourDTO.getNoOfSeats() + "\n\n"
                    +"From: "+bookTourDTO.getCity()+", "+bookTourDTO.getState()+"\n\n"
                    +"Your PNR number is: " + pnr + ". Kindly use this PNR for any future ticket cancellation or support requests.\n\n"
                    + "Thank you for choosing Traveller's Pick!\n";

            emailService.sendSimpleEMail(bookTourDTO.getEmail(),subject,body);
        }

        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "Tour Booked Successfully"));
    }

    //update user profile
    public ResponseEntity<?> updateUser(UserDTO userDTO, String email) {
        Customer user = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("User Email", email));
        if (email.equals(user.getEmail())) {
            if(userDTO.getUsername() != null && !userDTO.getUsername().isBlank())
                user.setUsername(userDTO.getUsername());
            if(userDTO.getEmail() != null && !userDTO.getEmail().isBlank())
                user.setEmail(userDTO.getEmail());
            if(userDTO.getContact() != null && !userDTO.getContact().isBlank())
                user.setContact(userDTO.getContact());


            userRepo.save(user);
        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).
                    body(new AResponse(LocalDateTime.now(),"Failure","User can update only own profile"));
        }
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(), "Success", "User Details Updated Successfully"));
    }

    //get all booked tours
    public ResponseEntity<?> getAllBookedTours(String email) {
        Customer user = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("User Email", email));

        if(!registerRepo.existsByUserId(user.getId())){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).
                    body(new AResponse(LocalDateTime.now(),"Failure","No Tours Found!"));
        }

        List<CustomerRegistry> userBookings=registerRepo.findByUserId(user.getId());
        List<TourDetailsDTO> bookedTourList=userBookings.stream()
                .map(t->new TourDetailsDTO(t.getTourId(),t.getName(),t.getEmail(),t.getPhone(),t.getPackageName(),t.getRegion(),t.getNoOfSeats(),
                        t.getNoOfAdults(),t.getNoOfChildren(),t.getBdate(),t.getTdate(),t.getStatus())).toList();
        return ResponseEntity.ok(bookedTourList);
    }


    //cancel tour
    public ResponseEntity<?> cancelTour(String PNR, String email) {
        Customer user = userRepo.findByEmail(email).orElseThrow(() -> new UnAuthorizedException("User Email", email));
        CustomerRegistry reg=registerRepo.findByPNR(PNR).orElseThrow(()->new UnAuthorizedException("PNR number",PNR));

        if (!reg.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).
                    body(new AResponse(LocalDateTime.now(),"Failure","This PNR does not belong to your account"));
        }
        if(reg.getStatus().equals("CANCELLED")){
            return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).
                    body(new AResponse(LocalDateTime.now(),"Failure","Already Cancelled!"));
        }

        reg.setStatus("CANCELLED");
        registerRepo.save(reg);

        if(user.getEmail()!=null && !user.getEmail().isEmpty()){
            String subject="Cancellation of Ticket Booking!";
            String body = "Hi " + reg.getName() + ",\n\n"
                    + "Your ticket has been cancelled successfully for the package: " + reg.getRegion() + ".\n\n"
                    + "Thank you for choosing Traveller's Pick!\n";

            emailService.sendSimpleEMail(reg.getEmail(),subject,body);
        }
        return ResponseEntity.ok(new AResponse(LocalDateTime.now(),"Success","Cancellation Successful!"));
    }


    //get the user data
    public ResponseEntity<?> userData(String email) {
        Customer user=userRepo.findByEmail(email).orElseThrow(()-> new UnAuthorizedException("User Email",email));
        UserDTO dto= new UserDTO(user);
        return ResponseEntity.ok(dto);
    }
}

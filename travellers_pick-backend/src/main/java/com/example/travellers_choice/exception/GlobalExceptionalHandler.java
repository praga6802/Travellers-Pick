package com.example.travellers_choice.exception;


import com.example.travellers_choice.dto.AResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionalHandler {


    @ExceptionHandler(AlreadyExistsException.class)
    public ResponseEntity<?> handleAlreadyExistsException(AlreadyExistsException exception){
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(),"Already Exists",exception.getMessage()),HttpStatus.CONFLICT);
    }

    @ExceptionHandler(IDNotFoundException.class)
    public ResponseEntity<?> handleIdNotFoundException(IDNotFoundException exception){
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(),"ID NOT FOUND",exception.getMessage()),HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(UnAuthorizedException.class)
    public ResponseEntity<?> handleUnauthorizedException(UnAuthorizedException exception){
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(),"Unauthorized",exception.getMessage()),HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException exception) {
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(),"Failure", "Invalid Credentials"), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException exception){
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(),"NOT FOUND", exception.getMessage()),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBusinessException(BusinessException exception) {
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(), "Failure", exception.getMessage()), HttpStatus.CONFLICT);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e){
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(),"Failure",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

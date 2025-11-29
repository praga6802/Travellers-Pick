package com.example.travellers_choice.exception;


import com.example.travellers_choice.dto.AResponse;
import com.example.travellers_choice.model.ErrorInfo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

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

    @ExceptionHandler(PackageNameNotFoundException.class)
    public ResponseEntity<?> handlePackageNotFoundException(PackageNameNotFoundException exception){
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(),"Package Not FOUND",exception.getMessage()),HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(UnAuthorizedException.class)
    public ResponseEntity<?> handleUnauthorizedException(UnAuthorizedException exception){
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(),"Unauthorized",exception.getMessage()),HttpStatus.UNAUTHORIZED);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e){
        return new ResponseEntity<>(new AResponse(LocalDateTime.now(),"Failure",e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

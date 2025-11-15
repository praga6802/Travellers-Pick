package com.example.travellers_choice.exception;


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
    public ResponseEntity<ErrorInfo> handleAlreadyExistsException(AlreadyExistsException exception){
        ErrorInfo errorInfo= new ErrorInfo(LocalDateTime.now(),"Already Exists",exception.getMessage());
        return new ResponseEntity<>(errorInfo,HttpStatus.FOUND);
    }

    @ExceptionHandler(IDNotFoundException.class)
    public ResponseEntity<ErrorInfo> handleIdNotFoundException(IDNotFoundException exception){
        ErrorInfo errorInfo= new ErrorInfo(LocalDateTime.now(),"Id Not Found",exception.getMessage());
        return new ResponseEntity<>(errorInfo,HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(UnAuthorizedException.class)
    public ResponseEntity<?> handleUnauthorizedException(UnAuthorizedException exception){
        ErrorInfo errorInfo = new ErrorInfo(LocalDateTime.now(),"Invalid Email",exception.getMessage());
        return new ResponseEntity<>(errorInfo,HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,String>> handleException(Exception e){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Something went wrong", "details",e.getMessage()));
    }

}

package com.example.travellers_choice.exception;

import org.springframework.http.HttpStatus;

public class UnAuthorizedException extends RuntimeException {
    public UnAuthorizedException(String fieldName, String value) {
        super(fieldName+" '"+value+"' "+"not found");
    }
}

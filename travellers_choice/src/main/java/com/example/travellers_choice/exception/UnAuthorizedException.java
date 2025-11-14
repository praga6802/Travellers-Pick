package com.example.travellers_choice.exception;

import org.springframework.http.HttpStatus;

public class UnAuthorizedException extends BaseException {
    public UnAuthorizedException(String fieldName, String value) {
        super(fieldName+" '"+value+"' "+"not found", HttpStatus.UNAUTHORIZED);
    }
}

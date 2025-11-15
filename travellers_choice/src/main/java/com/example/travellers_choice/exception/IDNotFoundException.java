package com.example.travellers_choice.exception;

import org.springframework.http.HttpStatus;

public class IDNotFoundException extends RuntimeException {


    public IDNotFoundException(String field,int id) {
        super(field+" "+id+" not found");
    }


}

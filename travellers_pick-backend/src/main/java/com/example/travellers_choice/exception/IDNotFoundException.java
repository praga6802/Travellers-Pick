package com.example.travellers_choice.exception;

public class IDNotFoundException extends RuntimeException {

    public IDNotFoundException(String field,int id) {
        super(field+" "+id+" not found");
    }
}

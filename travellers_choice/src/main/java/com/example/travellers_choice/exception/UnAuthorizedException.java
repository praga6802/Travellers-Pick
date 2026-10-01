package com.example.travellers_choice.exception;

public class UnAuthorizedException extends RuntimeException {
    public UnAuthorizedException(String value) {
        super(value);
    }
}

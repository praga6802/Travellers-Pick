package com.example.travellers_choice.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message+" not found!");
    }
}

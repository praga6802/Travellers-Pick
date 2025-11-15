package com.example.travellers_choice.exception;

import org.springframework.http.HttpStatus;

public class PackageNameNotFoundException extends RuntimeException {

    private String fieldName;
    private String value;
    public PackageNameNotFoundException(String fieldName, String value) {
        super(fieldName+" '"+value+"' "+" not found");
    }

    public String getFieldName() {
        return fieldName;
    }

    public String getValue() {
        return value;
    }
}

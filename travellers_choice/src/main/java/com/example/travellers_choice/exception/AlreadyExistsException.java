package com.example.travellers_choice.exception;

public class AlreadyExistsException extends  RuntimeException{

    private String field;
    private String value;

    public AlreadyExistsException(String field, String value) {
        super(field + " '" + value + "' already exists");
        this.field = field;
        this.value = value;
    }

    public String getField() {
        return field;
    }

    public String getValue() {
        return value;
    }
}

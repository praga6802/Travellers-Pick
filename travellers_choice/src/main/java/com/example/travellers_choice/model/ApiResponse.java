package com.example.travellers_choice.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse {

    private String message;
    private String status;
    private LocalDateTime localDateTime;

    private Object data;

    public ApiResponse(String message, String status, LocalDateTime localDateTime) {
        this.message = message;
        this.status = status;
        this.localDateTime=localDateTime;
        this.data=null;
    }



    public ApiResponse(String message, String status, LocalDateTime localDateTime, Object data) {
        this.message = message;
        this.status = status;
        this.localDateTime = localDateTime;
        this.data = data;
    }



    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public Object getData() {
        return data;
    }
}

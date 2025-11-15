package com.example.travellers_choice.model;

import java.time.LocalDateTime;

public class ApiResponse {

    private String message;
    private String status;
    private LocalDateTime localDateTime;

    public ApiResponse(String message, String status, LocalDateTime localDateTime) {
        this.message = message;
        this.status = status;
        this.localDateTime=localDateTime;
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
}

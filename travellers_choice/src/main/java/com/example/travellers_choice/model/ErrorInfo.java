package com.example.travellers_choice.model;


import jakarta.persistence.Entity;

import java.time.LocalDateTime;

public class ErrorInfo {

    private LocalDateTime localDateTime;
    private String error;
    private String details;

    public ErrorInfo(LocalDateTime localDateTime, String error, String details) {
        this.localDateTime = localDateTime;
        this.error = error;
        this.details = details;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}

package com.example.travellers_choice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AResponse {

    private LocalDateTime timeStamp;
    private String status;
    private String message;
    private Object data;

    public AResponse(LocalDateTime timeStamp, String status, String message) {
        this.timeStamp = timeStamp;
        this.status = status;
        this.message = message;
    }

    public AResponse(LocalDateTime timeStamp, String status, String message,Object data) {
        this.timeStamp = timeStamp;
        this.status = status;
        this.message = message;
        this.data = data;
    }


}

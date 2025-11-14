package com.example.travellers_choice.dto;

public class UserDTO {

    private String packageName;
    private String tourName;
    private String tDate;
    private int numSeats;

    public UserDTO(String packageName, String tourName, String tDate, int numSeats) {
        this.packageName = packageName;
        this.tourName = tourName;
        this.tDate = tDate;
        this.numSeats = numSeats;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }

    public String gettDate() {
        return tDate;
    }

    public void settDate(String tDate) {
        this.tDate = tDate;
    }

    public int getNumSeats() {
        return numSeats;
    }

    public void setNumSeats(int numSeats) {
        this.numSeats = numSeats;
    }
}



package com.example.travellers_choice.dto;

public class DeleteAdminDTO {

    private Integer adminId;
    private String password;

    public DeleteAdminDTO(Integer adminId, String password) {
        this.adminId = adminId;
        this.password = password;
    }

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

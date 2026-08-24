package com.healthcare.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private Long id;
    private String firstName;
    private String lastName;

    public AuthResponse() {}
    public AuthResponse(String token, String username, String role, Long id, String firstName, String lastName) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}

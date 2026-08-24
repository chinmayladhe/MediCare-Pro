package com.healthcare.service;

import com.healthcare.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuthService {
    AuthResponse registerPatient(PatientRegisterRequest request);
    AuthResponse login(LoginRequest request);
}

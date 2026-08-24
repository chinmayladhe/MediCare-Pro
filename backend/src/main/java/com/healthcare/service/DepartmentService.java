package com.healthcare.service;

import com.healthcare.dto.*;
import com.healthcare.entity.Department;
import java.util.List;

public interface DepartmentService {
    Department addDepartment(DepartmentRequest request);
    List<Department> getAllDepartments();
    Department getDepartmentById(Long id);
    Department updateDepartment(Long id, DepartmentRequest request);
    void deleteDepartment(Long id);
}

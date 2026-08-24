package com.healthcare.service.impl;

import com.healthcare.dto.*;
import com.healthcare.entity.*;
import com.healthcare.exception.*;
import com.healthcare.repository.*;
import com.healthcare.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public Department addDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Department name already exists");
        }
        Department dept = new Department();
        dept.setName(request.getName());
        dept.setDescription(request.getDescription());
        return departmentRepository.save(dept);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id " + id));
    }

    @Override
    public Department updateDepartment(Long id, DepartmentRequest request) {
        Department dept = getDepartmentById(id);
        
        // check unique constraint on update
        departmentRepository.findByNameIgnoreCase(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Department name already exists");
            }
        });

        dept.setName(request.getName());
        dept.setDescription(request.getDescription());
        return departmentRepository.save(dept);
    }

    @Override
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found with id " + id);
        }
        departmentRepository.deleteById(id);
    }
}

package com.healthcare.repository;

import com.healthcare.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    @Query("SELECT d FROM Doctor d WHERE " +
           "(:deptId IS NULL OR d.department.id = :deptId) AND " +
           "(:spec IS NULL OR LOWER(d.specialization) = LOWER(:spec)) AND " +
           "(:query IS NULL OR LOWER(d.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Doctor> filterAndSearchDoctors(
            @Param("deptId") Long deptId, 
            @Param("spec") String spec, 
            @Param("query") String query, 
            Pageable pageable);

    List<Doctor> findByDepartmentId(Long departmentId);
}
